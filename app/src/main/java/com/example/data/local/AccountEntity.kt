package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.data.model.RegisteredAccount
import com.example.data.model.StudentProfile
import com.example.data.model.University

@Entity(tableName = "student_accounts")
data class AccountEntity(
    @PrimaryKey
    val id: String,
    val email: String,
    val password: String,
    val username: String,
    val realName: String,
    val universityName: String,
    val universityShortName: String,
    val universityLocation: String,
    val course: String,
    val yearOfStudy: Int,
    val bio: String,
    val avatarUrl: String,
    val authProvider: String, // "EMAIL", "GOOGLE", "LINKEDIN", "GITHUB", "TWITTER"
    val googleEmail: String?,
    val socialHandle: String?,
    val isVerified: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
) {
    fun toRegisteredAccount(): RegisteredAccount {
        val uni = University(
            name = universityName,
            shortName = universityShortName,
            location = universityLocation
        )
        val profile = StudentProfile(
            id = id,
            username = username,
            displayName = realName,
            email = email,
            avatarUrl = avatarUrl,
            bio = bio,
            university = uni,
            course = course,
            yearOfStudy = yearOfStudy,
            isVerifiedStudent = isVerified
        )
        return RegisteredAccount(
            id = id,
            email = email,
            password = password,
            profile = profile,
            authProvider = authProvider,
            googleEmail = googleEmail,
            socialHandle = socialHandle,
            isRecordedInDatabase = true
        )
    }

    companion object {
        fun fromRegisteredAccount(acc: RegisteredAccount): AccountEntity {
            return AccountEntity(
                id = acc.profile.id,
                email = acc.email,
                password = acc.password,
                username = acc.profile.username,
                realName = acc.profile.displayName,
                universityName = acc.profile.university.name,
                universityShortName = acc.profile.university.shortName,
                universityLocation = acc.profile.university.location,
                course = acc.profile.course,
                yearOfStudy = acc.profile.yearOfStudy,
                bio = acc.profile.bio,
                avatarUrl = acc.profile.avatarUrl,
                authProvider = acc.authProvider,
                googleEmail = acc.googleEmail,
                socialHandle = acc.socialHandle,
                isVerified = acc.profile.isVerifiedStudent
            )
        }
    }
}
