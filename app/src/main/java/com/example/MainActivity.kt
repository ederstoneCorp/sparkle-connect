package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ui.components.SparkleNavBottomBar
import com.example.ui.components.SparkleTopBar
import com.example.ui.navigation.Screen
import com.example.ui.screens.*
import com.example.ui.theme.SparkleConnectTheme
import com.example.ui.viewmodel.SparkleViewModel
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val viewModel: SparkleViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            SparkleConnectTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route
                val isChatThread = currentRoute?.startsWith("chat/") == true

                val uiState by viewModel.uiState.collectAsStateWithLifecycle()
                val currentUser by viewModel.currentUser.collectAsStateWithLifecycle()
                val registeredAccounts by viewModel.registeredAccounts.collectAsStateWithLifecycle()
                val filteredPosts by viewModel.filteredPosts.collectAsStateWithLifecycle()
                val filteredGigs by viewModel.filteredGigs.collectAsStateWithLifecycle()
                val communities by viewModel.communities.collectAsStateWithLifecycle()
                val events by viewModel.events.collectAsStateWithLifecycle()
                val conversations by viewModel.conversations.collectAsStateWithLifecycle()
                val notifications by viewModel.notifications.collectAsStateWithLifecycle()
                val snackbarHostState = remember { SnackbarHostState() }
                val coroutineScope = rememberCoroutineScope()
                val authManager = remember { com.example.data.auth.AuthManager(this@MainActivity) }
                val firebaseUser by authManager.currentUser.collectAsStateWithLifecycle()
                var showCameraCapture by remember { mutableStateOf(false) }

                LaunchedEffect(uiState.snackbarMessage) {
                    uiState.snackbarMessage?.let { message ->
                        snackbarHostState.showSnackbar(message)
                        viewModel.clearSnackbar()
                    }
                }

                val unreadCount = notifications.count { !it.isRead }
                val unreadMessages = conversations.sumOf { it.unreadCount }

                val loggedInUser = currentUser

                if (loggedInUser == null) {
                    // AUTHENTICATION SCREEN GATE: Shown on app start
                    AuthScreen(
                        universities = viewModel.universities,
                        registeredAccounts = registeredAccounts,
                        onSignIn = { identifier, password ->
                            viewModel.signIn(identifier, password)
                        },
                        onSignUp = { fullName, username, email, password, university, course, yearOfStudy, socialProv, socialHandle, gEmail ->
                            viewModel.signUp(
                                fullName = fullName,
                                username = username,
                                email = email,
                                password = password,
                                university = university,
                                course = course,
                                yearOfStudy = yearOfStudy,
                                socialProvider = socialProv,
                                socialHandle = socialHandle,
                                googleEmail = gEmail
                            )
                        },
                        onSignUpWithGoogle = { realName, googleEmail, university, course, yearOfStudy ->
                            viewModel.signUpWithGoogle(realName, googleEmail, university, course, yearOfStudy)
                        },
                        onGoogleSignIn = { googleEmail ->
                            viewModel.signInWithGoogleAccount(googleEmail)
                        },
                        onSocialSignIn = { provider, handle ->
                            viewModel.signInWithSocial(provider, handle)
                        },
                        onLaunchCredentialManagerGoogle = {
                            coroutineScope.launch {
                                val result = authManager.signInWithGoogle()
                                if (result.isSuccess && result.getOrNull() != null) {
                                    val gUser = result.getOrNull()!!
                                    val gEmail = gUser.email ?: ""
                                    val gName = gUser.displayName ?: ""
                                    val signInRes = viewModel.signInWithGoogleAccount(gEmail, gName)
                                    if (signInRes.isFailure) {
                                        snackbarHostState.showSnackbar(
                                            signInRes.exceptionOrNull()?.message
                                                ?: "Failed to log in with Google account."
                                        )
                                    }
                                }
                            }
                        }
                    )
                } else {
                    // MAIN APPLICATION: Shown once authenticated
                    Scaffold(
                        modifier = Modifier.fillMaxSize(),
                        snackbarHost = { SnackbarHost(snackbarHostState) },
                        topBar = {
                            // Hide main top bar when viewing a specific conversation thread
                            if (!isChatThread) {
                                SparkleTopBar(
                                    selectedUniversity = uiState.selectedUniversityFilter,
                                    universities = viewModel.universities,
                                    onSelectUniversity = { viewModel.setUniversityFilter(it) },
                                    isSearchActive = uiState.isSearchActive,
                                    searchQuery = uiState.searchQuery,
                                    onSearchQueryChange = { viewModel.setSearchQuery(it) },
                                    onToggleSearch = { viewModel.toggleSearch() },
                                    unreadNotificationCount = unreadCount,
                                    onOpenNotifications = { viewModel.showNotifications(true) },
                                    onOpenProfile = { viewModel.showProfile(true) },
                                    userAvatarInitial = loggedInUser.displayName.split(" ")
                                        .mapNotNull { it.firstOrNull() }
                                        .joinToString("")
                                )
                            }
                        },
                        bottomBar = {
                            // Hide bottom nav when inside chat thread to give full keyboard space
                            if (!isChatThread) {
                                SparkleNavBottomBar(
                                    currentRoute = currentRoute,
                                    onNavigate = { screen ->
                                        navController.navigate(screen.route) {
                                            popUpTo(navController.graph.findStartDestination().id) {
                                                saveState = true
                                            }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    },
                                    unreadMessagesCount = unreadMessages
                                )
                            }
                        }
                    ) { innerPadding ->
                        NavHost(
                            navController = navController,
                            startDestination = Screen.Feed.route,
                            modifier = Modifier.padding(innerPadding)
                        ) {
                            composable(Screen.Feed.route) {
                                FeedScreen(
                                    posts = filteredPosts,
                                    selectedCategory = uiState.selectedCategory,
                                    onSelectCategory = { viewModel.setCategory(it) },
                                    onLikePost = { viewModel.toggleLike(it) },
                                    onAddComment = { postId, text -> viewModel.addComment(postId, text) },
                                    onCreatePostClick = { viewModel.showCreatePost(true) }
                                )
                            }
                            composable(Screen.Gigs.route) {
                                GigsScreen(
                                    gigs = filteredGigs,
                                    selectedCategory = uiState.selectedGigCategory,
                                    onSelectCategory = { viewModel.setGigCategory(it) },
                                    onBookmarkToggle = { viewModel.toggleGigBookmark(it) },
                                    onApplyClick = { viewModel.openApplyGig(it) },
                                    onCreateGigClick = { viewModel.showCreateGig(true) }
                                )
                            }
                            composable(Screen.Communities.route) {
                                CommunitiesScreen(
                                    communities = communities,
                                    onToggleJoin = { viewModel.toggleCommunityMembership(it) }
                                )
                            }
                            composable(Screen.Events.route) {
                                EventsScreen(
                                    events = events,
                                    onToggleRegistration = { viewModel.toggleEventRegistration(it) }
                                )
                            }
                            composable(Screen.Messages.route) {
                                MessagesScreen(
                                    conversations = conversations,
                                    activeConversation = null,
                                    onSelectConversation = { conv ->
                                        if (conv != null) {
                                            navController.navigate(Screen.ChatThread.createRoute(conv.id))
                                        }
                                    },
                                    onSendMessage = { convId, text -> viewModel.sendMessage(convId, text) }
                                )
                            }
                            composable(
                                route = Screen.ChatThread.route,
                                arguments = listOf(navArgument("conversationId") { type = NavType.StringType })
                            ) { backStackEntry ->
                                val conversationId = backStackEntry.arguments?.getString("conversationId")
                                val conversation = conversations.find { it.id == conversationId }
                                if (conversation != null) {
                                    ChatThreadView(
                                        conversation = conversation,
                                        onBack = { navController.popBackStack() },
                                        onSendMessage = { text -> viewModel.sendMessage(conversation.id, text) }
                                    )
                                }
                            }
                        }

                        // Modals and Sheets
                        if (uiState.showCreatePostDialog) {
                            CreatePostDialog(
                                onDismiss = { viewModel.showCreatePost(false) },
                                onSubmit = { content, category, isAnon ->
                                    viewModel.submitPost(content, category, isAnon)
                                }
                            )
                        }

                        if (uiState.showCreateGigDialog) {
                            CreateGigDialog(
                                onDismiss = { viewModel.showCreateGig(false) },
                                onSubmit = { title, desc, cat, skills, type, comp ->
                                    viewModel.createGig(title, desc, cat, skills, type, comp)
                                }
                            )
                        }

                        uiState.selectedGigForApply?.let { gig ->
                            ApplyGigDialog(
                                gig = gig,
                                onDismiss = { viewModel.openApplyGig(null) },
                                onSubmit = { note, link, phone ->
                                    viewModel.submitGigApplication(gig.id, note, link, phone)
                                }
                            )
                        }

                        if (uiState.showProfileSheet) {
                            ProfileSheet(
                                user = loggedInUser,
                                universities = viewModel.universities,
                                firebaseUserEmail = firebaseUser?.email,
                                onSignInWithGoogle = {
                                    coroutineScope.launch {
                                        val result = authManager.signInWithGoogle()
                                        if (result.isSuccess) {
                                            snackbarHostState.showSnackbar(
                                                "Signed in as ${result.getOrNull()?.email ?: "Student"}"
                                            )
                                        } else {
                                            snackbarHostState.showSnackbar(
                                                result.exceptionOrNull()?.message ?: "Google Sign-In failed"
                                            )
                                        }
                                    }
                                },
                                onSignOut = {
                                    authManager.signOut()
                                    viewModel.signOut()
                                    coroutineScope.launch {
                                        snackbarHostState.showSnackbar("Signed out of Sparkle Connect")
                                    }
                                },
                                onTakePhotoClick = {
                                    showCameraCapture = true
                                },
                                onDismiss = { viewModel.showProfile(false) },
                                onSaveProfile = { bio, fac, course, year ->
                                    viewModel.updateProfile(bio, fac, course, year)
                                },
                                onSwitchUniversity = { uni ->
                                    viewModel.switchUniversity(uni)
                                }
                            )
                        }

                        if (showCameraCapture) {
                            com.example.ui.camera.StudentProfilePhotoCaptureDialog(
                                onDismiss = { showCameraCapture = false },
                                onPhotoCaptured = { uri ->
                                    coroutineScope.launch {
                                        snackbarHostState.showSnackbar("Student profile photo updated!")
                                    }
                                }
                            )
                        }

                        if (uiState.showNotificationsSheet) {
                            NotificationsSheet(
                                notifications = notifications,
                                onDismiss = { viewModel.showNotifications(false) }
                            )
                        }
                    }
                }
            }
        }
    }
}
