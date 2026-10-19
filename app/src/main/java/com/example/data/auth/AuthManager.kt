package com.example.data.auth

import android.content.Context
import android.util.Log
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import com.example.R
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.tasks.await

class AuthManager(private val context: Context) {

    private val auth: FirebaseAuth? by lazy {
        try {
            if (com.google.firebase.FirebaseApp.getApps(context).isNotEmpty()) {
                FirebaseAuth.getInstance()
            } else {
                null
            }
        } catch (e: Throwable) {
            Log.w(TAG, "Firebase Auth not available: ${e.message}")
            null
        }
    }
    private val credentialManager: CredentialManager by lazy { CredentialManager.create(context) }

    private val _currentUser = MutableStateFlow<FirebaseUser?>(null)
    val currentUser: StateFlow<FirebaseUser?> = _currentUser.asStateFlow()

    init {
        try {
            auth?.let { fbAuth ->
                _currentUser.value = fbAuth.currentUser
                fbAuth.addAuthStateListener { firebaseAuth ->
                    _currentUser.value = firebaseAuth.currentUser
                }
            }
        } catch (e: Throwable) {
            Log.w(TAG, "Firebase Auth initialization notice: ${e.message}")
        }
    }

    suspend fun signInWithGoogle(): Result<FirebaseUser?> {
        val serverClientId = context.getString(R.string.default_web_client_id)
        if (serverClientId.isBlank()) {
            return Result.failure(
                IllegalStateException("Google Client ID (default_web_client_id) is not configured yet.")
            )
        }

        val fbAuth = auth ?: return Result.failure(IllegalStateException("Firebase Auth is not initialized"))

        return try {
            val googleIdOption = GetSignInWithGoogleOption.Builder(serverClientId)
                .build()

            val request = GetCredentialRequest.Builder()
                .addCredentialOption(googleIdOption)
                .build()

            val result = credentialManager.getCredential(context = context, request = request)
            val credential = result.credential

            if (credential is CustomCredential &&
                credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
            ) {
                val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)
                val idToken = googleIdTokenCredential.idToken
                val authCredential = GoogleAuthProvider.getCredential(idToken, null)
                val authResult = fbAuth.signInWithCredential(authCredential).await()
                _currentUser.value = authResult.user
                Result.success(authResult.user)
            } else {
                Result.failure(IllegalStateException("Unexpected credential type: ${credential.type}"))
            }
        } catch (e: GetCredentialCancellationException) {
            Result.failure(e)
        } catch (e: Exception) {
            Log.e(TAG, "Google Sign-In failed", e)
            Result.failure(e)
        }
    }

    fun signOut() {
        try {
            auth?.signOut()
            _currentUser.value = null
        } catch (e: Exception) {
            Log.e(TAG, "Sign out error", e)
        }
    }

    companion object {
        private const val TAG = "AuthManager"
    }
}
