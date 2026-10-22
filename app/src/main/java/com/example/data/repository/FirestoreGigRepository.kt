package com.example.data.repository

import android.content.Context
import android.util.Log
import com.example.R
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.IgnoreExtraProperties
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ServerTimestamp
import com.google.firebase.firestore.snapshots
import com.google.firebase.firestore.toObjects
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await

@IgnoreExtraProperties
data class FirestoreGig(
    @DocumentId val id: String = "",
    val title: String = "",
    val description: String = "",
    val category: String = "",
    val skillsRequired: List<String> = emptyList(),
    val opportunityType: String = "Freelance",
    val isPaid: Boolean = true,
    val compensation: String = "",
    val publisherId: String = "",
    val publisherName: String = "",
    val publisherUniversity: String = "",
    val deadline: String = "",
    val status: String = "open",
    val applicationsCount: Long = 0L,
    @ServerTimestamp val createdAt: Timestamp? = null,
    @ServerTimestamp val updatedAt: Timestamp? = null
)

@IgnoreExtraProperties
data class FirestoreGigApplication(
    @DocumentId val id: String = "",
    val gigId: String = "",
    val applicantId: String = "",
    val applicantName: String = "",
    val applicantUniversity: String = "",
    val coverNote: String = "",
    val portfolioLink: String = "",
    val phone: String = "",
    val status: String = "submitted",
    @ServerTimestamp val submittedAt: Timestamp? = null
)

class FirestoreGigRepository(
    private val db: FirebaseFirestore? = null,
    private val auth: FirebaseAuth? = null
) {
    // Secondary constructor resolving database safely without throwing during startup
    constructor(context: Context) : this(
        db = try {
            if (com.google.firebase.FirebaseApp.getApps(context).isNotEmpty()) {
                val dbId = context.getString(R.string.firestore_database_id)
                if (dbId.isNotBlank() && dbId != "(default)") {
                    FirebaseFirestore.getInstance(dbId)
                } else {
                    FirebaseFirestore.getInstance()
                }
            } else null
        } catch (e: Throwable) {
            Log.w(TAG, "Firestore initialization notice: ${e.message}")
            null
        },
        auth = try {
            if (com.google.firebase.FirebaseApp.getApps(context).isNotEmpty()) {
                FirebaseAuth.getInstance()
            } else null
        } catch (e: Throwable) {
            Log.w(TAG, "FirebaseAuth initialization notice: ${e.message}")
            null
        }
    )

    private fun requireUserId(): String {
        return auth?.currentUser?.uid
            ?: throw IllegalStateException("User must be signed in to perform this operation")
    }

    /**
     * Real-time stream of all open campus gigs from Firestore
     */
    fun observeGigs(): Flow<List<FirestoreGig>> {
        val firestoreDb = db ?: return kotlinx.coroutines.flow.flowOf(emptyList())
        return firestoreDb.collection(COLLECTION_GIGS)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .snapshots()
            .map { snapshot ->
                snapshot.toObjects(FirestoreGig::class.java, DocumentSnapshot.ServerTimestampBehavior.ESTIMATE)
            }
            .catch { error ->
                Log.w(TAG, "Error observing gigs from Firestore: ${error.message}", error)
                emit(emptyList())
            }
    }

    /**
     * Fetch a single gig document by ID
     */
    suspend fun getGig(gigId: String): FirestoreGig? {
        val firestoreDb = db ?: return null
        return try {
            val doc = firestoreDb.collection(COLLECTION_GIGS)
                .document(gigId)
                .get()
                .await()
            doc.toObject(FirestoreGig::class.java, DocumentSnapshot.ServerTimestampBehavior.ESTIMATE)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to get gig $gigId", e)
            null
        }
    }

    /**
     * Publish a new gig to Firestore
     */
    suspend fun createGig(
        title: String,
        description: String,
        category: String,
        skillsRequired: List<String>,
        opportunityType: String,
        compensation: String,
        publisherName: String,
        publisherUniversity: String,
        deadline: String
    ): Result<String> {
        val firestoreDb = db ?: return Result.failure(IllegalStateException("Firestore is not available"))
        return try {
            val userId = requireUserId()
            val newGig = FirestoreGig(
                title = title,
                description = description,
                category = category,
                skillsRequired = skillsRequired,
                opportunityType = opportunityType,
                isPaid = compensation.isNotBlank(),
                compensation = compensation,
                publisherId = userId,
                publisherName = publisherName,
                publisherUniversity = publisherUniversity,
                deadline = deadline,
                status = "open",
                applicationsCount = 0L,
                createdAt = null,
                updatedAt = null
            )

            val docRef = firestoreDb.collection(COLLECTION_GIGS).add(newGig).await()
            Result.success(docRef.id)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to create gig", e)
            Result.failure(e)
        }
    }

    /**
     * Submit an application for a gig
     */
    suspend fun applyForGig(
        gigId: String,
        applicantName: String,
        applicantUniversity: String,
        coverNote: String,
        portfolioLink: String,
        phone: String
    ): Result<String> {
        val firestoreDb = db ?: return Result.failure(IllegalStateException("Firestore is not available"))
        return try {
            val userId = requireUserId()
            val application = FirestoreGigApplication(
                gigId = gigId,
                applicantId = userId,
                applicantName = applicantName,
                applicantUniversity = applicantUniversity,
                coverNote = coverNote,
                portfolioLink = portfolioLink,
                phone = phone,
                status = "submitted",
                submittedAt = null
            )

            val appRef = firestoreDb.collection(COLLECTION_GIGS)
                .document(gigId)
                .collection(COLLECTION_APPLICATIONS)
                .add(application)
                .await()

            // Increment applications count using Firestore transaction / field value
            firestoreDb.collection(COLLECTION_GIGS)
                .document(gigId)
                .update("applicationsCount", com.google.firebase.firestore.FieldValue.increment(1))
                .await()

            Result.success(appRef.id)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to apply for gig $gigId", e)
            Result.failure(e)
        }
    }

    /**
     * Stream applications for a gig (accessible by gig owner)
     */
    fun observeApplications(gigId: String): Flow<List<FirestoreGigApplication>> {
        val firestoreDb = db ?: return kotlinx.coroutines.flow.flowOf(emptyList())
        return firestoreDb.collection(COLLECTION_GIGS)
            .document(gigId)
            .collection(COLLECTION_APPLICATIONS)
            .orderBy("submittedAt", Query.Direction.DESCENDING)
            .snapshots()
            .map { snapshot ->
                snapshot.toObjects(FirestoreGigApplication::class.java, DocumentSnapshot.ServerTimestampBehavior.ESTIMATE)
            }
            .catch { error ->
                Log.w(TAG, "Error observing applications for gig $gigId: ${error.message}", error)
                emit(emptyList())
            }
    }

    companion object {
        private const val TAG = "FirestoreGigRepo"
        const val COLLECTION_GIGS = "gigs"
        const val COLLECTION_APPLICATIONS = "applications"
    }
}
