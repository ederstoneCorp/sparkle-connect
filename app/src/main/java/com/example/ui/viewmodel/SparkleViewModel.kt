package com.example.ui.viewmodel
 
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.SparkleDatabase
import com.example.data.model.*
import com.example.data.repository.SparkleRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

enum class SparkleTab(val label: String) {
    FEED("Feed"),
    GIGS("Gigs"),
    COMMUNITIES("Clubs"),
    EVENTS("Events"),
    MESSAGES("Messages")
}

data class SparkleUiState(
    val selectedTab: SparkleTab = SparkleTab.FEED,
    val selectedUniversityFilter: String? = null, // null means All Universities
    val selectedCategory: PostCategory = PostCategory.ALL,
    val selectedGigCategory: String = "All",
    val searchQuery: String = "",
    val isSearchActive: Boolean = false,
    val showCreatePostDialog: Boolean = false,
    val showCreateGigDialog: Boolean = false,
    val showNotificationsSheet: Boolean = false,
    val showProfileSheet: Boolean = false,
    val selectedGigForApply: Gig? = null,
    val activeConversation: Conversation? = null,
    val snackbarMessage: String? = null,
)

class SparkleViewModel(
    application: Application,
    private val repository: SparkleRepository = SparkleRepository(
        SparkleDatabase.getDatabase(application).accountDao()
    )
) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(SparkleUiState())
    val uiState: StateFlow<SparkleUiState> = _uiState.asStateFlow()

    val currentUser = repository.currentUser
    val posts = repository.posts
    val gigs = repository.gigs
    val communities = repository.communities
    val events = repository.events
    val conversations = repository.conversations
    val notifications = repository.notifications
    val universities = repository.universitiesList

    // Filtered Posts
    val filteredPosts = combine(
        repository.posts,
        _uiState.map { it.selectedCategory }.distinctUntilChanged(),
        _uiState.map { it.selectedUniversityFilter }.distinctUntilChanged(),
        _uiState.map { it.searchQuery }.distinctUntilChanged()
    ) { allPosts, category, uniFilter, query ->
        allPosts.filter { post ->
            val matchCategory = category == PostCategory.ALL || post.category == category
            val matchUni = uniFilter == null || post.authorUniversity.contains(uniFilter, ignoreCase = true)
            val matchQuery = query.isBlank() ||
                    post.content.contains(query, ignoreCase = true) ||
                    post.authorName.contains(query, ignoreCase = true)
            matchCategory && matchUni && matchQuery
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    // Filtered Gigs
    val filteredGigs = combine(
        repository.gigs,
        _uiState.map { it.selectedGigCategory }.distinctUntilChanged(),
        _uiState.map { it.searchQuery }.distinctUntilChanged()
    ) { allGigs, category, query ->
        allGigs.filter { gig ->
            val matchCat = category == "All" || gig.category.contains(category, ignoreCase = true)
            val matchQuery = query.isBlank() ||
                    gig.title.contains(query, ignoreCase = true) ||
                    gig.description.contains(query, ignoreCase = true) ||
                    gig.skillsRequired.any { it.contains(query, ignoreCase = true) }
            matchCat && matchQuery
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    fun selectTab(tab: SparkleTab) {
        _uiState.update { it.copy(selectedTab = tab, activeConversation = null) }
    }

    fun setCategory(category: PostCategory) {
        _uiState.update { it.copy(selectedCategory = category) }
    }

    fun setGigCategory(category: String) {
        _uiState.update { it.copy(selectedGigCategory = category) }
    }

    fun setUniversityFilter(uniShortName: String?) {
        _uiState.update { it.copy(selectedUniversityFilter = uniShortName) }
    }

    fun setSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun toggleSearch() {
        _uiState.update { it.copy(isSearchActive = !it.isSearchActive, searchQuery = "") }
    }

    fun showCreatePost(show: Boolean) {
        _uiState.update { it.copy(showCreatePostDialog = show) }
    }

    fun showCreateGig(show: Boolean) {
        _uiState.update { it.copy(showCreateGigDialog = show) }
    }

    fun showNotifications(show: Boolean) {
        _uiState.update { it.copy(showNotificationsSheet = show) }
    }

    fun showProfile(show: Boolean) {
        _uiState.update { it.copy(showProfileSheet = show) }
    }

    fun openApplyGig(gig: Gig?) {
        _uiState.update { it.copy(selectedGigForApply = gig) }
    }

    fun openConversation(conversation: Conversation?) {
        _uiState.update { it.copy(activeConversation = conversation) }
    }

    fun clearSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }

    // Actions
    fun submitPost(content: String, category: PostCategory, isAnonymous: Boolean) {
        repository.addPost(content, category, isAnonymous)
        _uiState.update {
            it.copy(
                showCreatePostDialog = false,
                snackbarMessage = if (isAnonymous) "Secret post published safely!" else "Post shared with campus!"
            )
        }
    }

    fun toggleLike(postId: String) {
        repository.toggleLike(postId)
    }

    fun addComment(postId: String, text: String) {
        if (text.isNotBlank()) {
            repository.addComment(postId, text)
        }
    }

    fun toggleGigBookmark(gigId: String) {
        repository.toggleGigBookmark(gigId)
    }

    fun submitGigApplication(gigId: String, coverNote: String, portfolioLink: String, phone: String) {
        repository.applyForGig(gigId, coverNote, portfolioLink, phone)
        _uiState.update {
            it.copy(
                selectedGigForApply = null,
                snackbarMessage = "Application submitted to opportunity owner!"
            )
        }
    }

    fun createGig(title: String, description: String, category: String, skills: List<String>, type: GigOpportunityType, compensation: String) {
        repository.createGig(title, description, category, skills, type, compensation)
        _uiState.update {
            it.copy(
                showCreateGigDialog = false,
                snackbarMessage = "Gig posted to student marketplace!"
            )
        }
    }

    fun toggleCommunityMembership(communityId: String) {
        repository.toggleCommunityMembership(communityId)
    }

    fun toggleEventRegistration(eventId: String) {
        repository.toggleEventRegistration(eventId)
    }

    fun sendMessage(conversationId: String, text: String) {
        if (text.isNotBlank()) {
            repository.sendMessage(conversationId, text)
            // Refresh active conversation in UI state
            val updated = repository.conversations.value.find { it.id == conversationId }
            _uiState.update { it.copy(activeConversation = updated) }
        }
    }

    fun updateProfile(bio: String, faculty: String, course: String, year: Int) {
        repository.updateProfile(bio, faculty, course, year)
        _uiState.update { it.copy(snackbarMessage = "Profile updated!") }
    }

    fun switchUniversity(university: University) {
        repository.switchUniversity(university)
        _uiState.update { it.copy(snackbarMessage = "Campus switched to ${university.shortName}") }
    }

    val registeredAccounts = repository.registeredAccounts

    fun signUp(
        fullName: String,
        username: String,
        email: String,
        password: String,
        university: University,
        course: String,
        yearOfStudy: Int,
        socialProvider: String = "EMAIL",
        socialHandle: String? = null,
        googleEmail: String? = null
    ): Result<StudentProfile> {
        val res = repository.signUp(
            fullName, username, email, password, university, course, yearOfStudy,
            socialProvider, socialHandle, googleEmail
        )
        if (res.isSuccess) {
            _uiState.update {
                it.copy(snackbarMessage = "Welcome to Sparkle Connect, ${res.getOrNull()?.displayName}! Your profile is stored in the database.")
            }
        }
        return res
    }

    fun signUpWithGoogle(
        realName: String,
        googleEmail: String,
        university: University,
        course: String,
        yearOfStudy: Int,
        avatarUrl: String? = null
    ): Result<StudentProfile> {
        val res = repository.signUpWithGoogle(realName, googleEmail, university, course, yearOfStudy, avatarUrl)
        if (res.isSuccess) {
            _uiState.update {
                it.copy(snackbarMessage = "Google account linked and stored in database! Welcome, ${res.getOrNull()?.displayName}!")
            }
        }
        return res
    }

    fun signIn(identifier: String, password: String): Result<StudentProfile> {
        val res = repository.signIn(identifier, password)
        if (res.isSuccess) {
            _uiState.update { it.copy(snackbarMessage = "Welcome back, ${res.getOrNull()?.displayName}!") }
        }
        return res
    }

    fun signInWithGoogleAccount(googleEmail: String): Result<StudentProfile> {
        val res = repository.signInWithGoogleAccount(googleEmail)
        if (res.isSuccess) {
            _uiState.update { it.copy(snackbarMessage = "Signed in as ${res.getOrNull()?.displayName} via Google") }
        }
        return res
    }

    fun signInWithSocial(provider: String, handleOrEmail: String): Result<StudentProfile> {
        val res = repository.signInWithSocial(provider, handleOrEmail)
        if (res.isSuccess) {
            _uiState.update { it.copy(snackbarMessage = "Signed in as ${res.getOrNull()?.displayName} via $provider") }
        }
        return res
    }

    fun signOut() {
        repository.signOut()
        _uiState.update {
            it.copy(
                selectedTab = SparkleTab.FEED,
                activeConversation = null,
                showProfileSheet = false,
                snackbarMessage = "Signed out of Sparkle Connect"
            )
        }
    }
}
