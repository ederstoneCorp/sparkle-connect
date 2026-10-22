package com.example.data.api

import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

data class CampusSearchResult(
    val query: String,
    val answer: String,
    val searchQueriesUsed: List<String> = emptyList(),
    val timestamp: String = "Just now"
)

object GeminiSearchService {

    private val client = OkHttpClient.Builder()
        .connectTimeout(25, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .writeTimeout(25, TimeUnit.SECONDS)
        .build()

    suspend fun searchCampusGroundedInfo(query: String): Result<CampusSearchResult> = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isBlank() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext Result.failure(
                IllegalStateException("Gemini API key missing. Please configure GEMINI_API_KEY in AI Studio Secrets panel.")
            )
        }

        try {
            val endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$apiKey"

            val systemInstructionText = "You are the Sparkle Connect Kenya Campus AI Guide. Provide concise, accurate, structured, and up-to-date facts about Kenyan universities, campus locations, faculties, hostels, study spots, student life, and events. Format responses with clean headings, bullet points, and helpful emojis."

            val jsonBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().put("text", "Kenyan Campus Query: $query"))
                        })
                    })
                })
                put("systemInstruction", JSONObject().apply {
                    put("parts", JSONArray().apply {
                        put(JSONObject().put("text", systemInstructionText))
                    })
                })
                put("tools", JSONArray().apply {
                    put(JSONObject().put("googleSearch", JSONObject()))
                })
            }

            val request = Request.Builder()
                .url(endpoint)
                .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
                .build()

            val response = client.newCall(request).execute()
            val responseString = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                return@withContext Result.failure(Exception("Search failed (${response.code}): $responseString"))
            }

            val responseJson = JSONObject(responseString)
            val candidates = responseJson.optJSONArray("candidates")
            val firstCandidate = candidates?.optJSONObject(0)
            val content = firstCandidate?.optJSONObject("content")
            val parts = content?.optJSONArray("parts")

            val textResult = StringBuilder()
            if (parts != null) {
                for (i in 0 until parts.length()) {
                    val part = parts.optJSONObject(i)
                    val text = part?.optString("text")
                    if (!text.isNullOrBlank()) {
                        textResult.append(text)
                    }
                }
            }

            val groundingMetadata = firstCandidate?.optJSONObject("groundingMetadata")
            val searchQueries = mutableListOf<String>()

            if (groundingMetadata != null) {
                val queries = groundingMetadata.optJSONArray("webSearchQueries")
                if (queries != null) {
                    for (i in 0 until queries.length()) {
                        val q = queries.optString(i)
                        if (!q.isNullOrBlank()) searchQueries.add(q)
                    }
                }
            }

            val finalAnswer = textResult.toString().ifBlank {
                "No detailed ground information returned for '$query'."
            }

            Result.success(
                CampusSearchResult(
                    query = query,
                    answer = finalAnswer,
                    searchQueriesUsed = searchQueries
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
