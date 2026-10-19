package com.example.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Feed : Screen(
        route = "feed",
        title = "Feed",
        selectedIcon = Icons.Filled.DynamicFeed,
        unselectedIcon = Icons.Outlined.DynamicFeed
    )

    object Gigs : Screen(
        route = "gigs",
        title = "Gigs",
        selectedIcon = Icons.Filled.Work,
        unselectedIcon = Icons.Outlined.WorkOutline
    )

    object Communities : Screen(
        route = "communities",
        title = "Clubs",
        selectedIcon = Icons.Filled.Groups,
        unselectedIcon = Icons.Outlined.Groups
    )

    object Events : Screen(
        route = "events",
        title = "Events",
        selectedIcon = Icons.Filled.Event,
        unselectedIcon = Icons.Outlined.Event
    )

    object Messages : Screen(
        route = "messages",
        title = "Messages",
        selectedIcon = Icons.Filled.ChatBubble,
        unselectedIcon = Icons.Outlined.ChatBubbleOutline
    )

    object ChatThread : Screen(
        route = "chat/{conversationId}",
        title = "Chat",
        selectedIcon = Icons.Filled.Chat,
        unselectedIcon = Icons.Outlined.Chat
    ) {
        fun createRoute(conversationId: String): String = "chat/$conversationId"
    }

    companion object {
        val bottomNavItems = listOf(Feed, Gigs, Communities, Events, Messages)
    }
}
