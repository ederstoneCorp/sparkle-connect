package com.example.data.model

import java.util.UUID

data class University(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val shortName: String,
    val location: String,
    val website: String = "",
)

data class StudentProfile(
    val id: String = UUID.randomUUID().toString(),
    val username: String,
    val displayName: String,
    val avatarUrl: String = "",
    val bio: String = "",
    val university: University,
    val faculty: String = "",
    val course: String = "",
    val yearOfStudy: Int = 2,
    val isVerifiedStudent: Boolean = true,
    val skills: List<String> = emptyList(),
    val interests: List<String> = emptyList(),
    val email: String = "",
    val joinedDate: String = "September 2024",
    val isPrivateAccount: Boolean = false,
    val blockedUserIds: List<String> = emptyList(),
)

enum class PostCategory(val displayName: String, val icon: String) {
    ALL("All", "sparkle"),
    CAMPUS_LIFE("Campus Life", "school"),
    TECH("Tech & Coding", "code"),
    ACADEMICS("Academics", "menu_book"),
    CAREER("Careers & Gigs", "work"),
    OPPORTUNITIES("Opportunities", "stars"),
    ANONYMOUS("Secret Confessions", "visibility_off"),
    ENTREPRENEURSHIP("Startup & Biz", "trending_up"),
}

enum class PostVisibility(val label: String, val icon: String) {
    PUBLIC("Public", "public"),
    CAMPUS_COMMUNITY("Campus Community", "school"),
    CONNECTIONS_ONLY("Connections Only", "group"),
    PRIVATE("Only Me", "lock")
}

data class PostComment(
    val id: String = UUID.randomUUID().toString(),
    val authorId: String = "",
    val authorName: String,
    val authorAvatar: String,
    val authorUniversity: String,
    val content: String,
    val timeAgo: String = "Just now",
    val isAnonymous: Boolean = false,
    val isReported: Boolean = false,
)

data class CampusPost(
    val id: String = UUID.randomUUID().toString(),
    val authorId: String,
    val authorName: String,
    val authorAvatar: String,
    val authorUniversity: String,
    val authorCourse: String = "",
    val isAuthorVerified: Boolean = true,
    val content: String,
    val category: PostCategory,
    val isAnonymous: Boolean = false,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val isLikedByMe: Boolean = false,
    val isSavedByMe: Boolean = false,
    val timeAgo: String = "10m ago",
    val comments: List<PostComment> = emptyList(),
    val mediaUrl: String? = null,
    val images: List<String> = emptyList(),
    val visibility: PostVisibility = PostVisibility.PUBLIC,
    val commentsDisabled: Boolean = false,
    val isReported: Boolean = false,
)

enum class MomentAudience(val label: String) {
    PUBLIC("All Campuses"),
    CAMPUS_ONLY("My University Only"),
    CONNECTIONS_ONLY("Connections Only")
}

data class SparkleMoment(
    val id: String = UUID.randomUUID().toString(),
    val authorId: String,
    val authorName: String,
    val authorAvatar: String,
    val authorUniversity: String,
    val mediaUri: String? = null,
    val textCaption: String = "",
    val backgroundColorHex: String = "#6C3BFF",
    val createdAtTimestamp: Long = System.currentTimeMillis(),
    val audience: MomentAudience = MomentAudience.PUBLIC,
    val viewedByUsers: List<String> = emptyList(),
    val isViewedByMe: Boolean = false,
)

enum class GigOpportunityType(val label: String) {
    FREELANCE("Freelance"),
    INTERNSHIP("Internship"),
    TUTORING("Tutoring"),
    CAMPUS_SERVICE("Campus Support"),
    COLLABORATION("Project Partner"),
    PART_TIME("Part-Time"),
}

data class Gig(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val category: String,
    val skillsRequired: List<String>,
    val opportunityType: GigOpportunityType,
    val isPaid: Boolean,
    val compensation: String,
    val locationType: String = "Remote / On-Campus",
    val publisherName: String,
    val publisherUniversity: String,
    val publisherAvatar: String,
    val deadline: String,
    val isBookmarked: Boolean = false,
    val hasApplied: Boolean = false,
    val applicationsCount: Int = 0,
)

data class GigApplication(
    val id: String = UUID.randomUUID().toString(),
    val gigId: String,
    val applicantName: String,
    val applicantUniversity: String,
    val coverNote: String,
    val portfolioLink: String = "",
    val phone: String = "",
    val status: String = "Submitted",
    val submittedAt: String = "Today",
)

data class Community(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String,
    val category: String,
    val universityAffiliation: String, // Can be "All Kenyan Universities" or specific
    val membersCount: Int,
    val isPrivate: Boolean = false,
    val isJoined: Boolean = false,
    val leaderName: String,
    val tags: List<String> = emptyList(),
)

data class CampusEvent(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val organizer: String,
    val university: String,
    val venue: String,
    val isOnline: Boolean = false,
    val dateString: String,
    val timeString: String,
    val category: String,
    val attendeeCount: Int = 0,
    val capacity: Int? = null,
    val isRegistered: Boolean = false,
    val coverGradientIndex: Int = 0,
)

data class ChatMessage(
    val id: String = UUID.randomUUID().toString(),
    val senderId: String,
    val senderName: String,
    val text: String,
    val timestamp: String,
    val isFromMe: Boolean,
)

data class Conversation(
    val id: String = UUID.randomUUID().toString(),
    val participantName: String,
    val participantAvatar: String,
    val participantUniversity: String,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0,
    val isOnline: Boolean = false,
    val isTyping: Boolean = false,
    val messages: List<ChatMessage> = emptyList(),
)

data class SparkleNotification(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val body: String,
    val timeAgo: String,
    val type: String, // "gig", "message", "event", "community", "system"
    val isRead: Boolean = false,
)

enum class SocialProvider(val displayName: String, val handlePrefix: String) {
    GOOGLE("Google", ""),
    LINKEDIN("LinkedIn", "linkedin.com/in/"),
    GITHUB("GitHub", "github.com/"),
    TWITTER("Twitter / X", "@")
}

data class RegisteredAccount(
    val id: String = UUID.randomUUID().toString(),
    val email: String,
    val password: String = "",
    val profile: StudentProfile,
    val authProvider: String = "EMAIL",
    val googleEmail: String? = null,
    val socialHandle: String? = null,
    val isRecordedInDatabase: Boolean = true
)
