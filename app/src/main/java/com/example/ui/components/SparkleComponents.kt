package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.SparkleTab

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SparkleTopBar(
    selectedUniversity: String?,
    universities: List<University>,
    onSelectUniversity: (String?) -> Unit,
    isSearchActive: Boolean,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    onToggleSearch: () -> Unit,
    unreadNotificationCount: Int,
    onOpenNotifications: () -> Unit,
    onOpenProfile: () -> Unit,
    userAvatarInitial: String,
    modifier: Modifier = Modifier,
) {
    var showUniMenu by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        shadowElevation = 1.dp
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Logo & Brand
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.testTag("brand_header")
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(SparklePrimaryGradient),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = "Sparkle Icon",
                            tint = Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Sparkle",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    color = SparklePurple
                                )
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Connect",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                        }
                        Text(
                            text = "Kenya Campus Hub 🇰🇪",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 10.sp
                            )
                        )
                    }
                }

                // Action controls: Uni Filter, Search, Notifs, Profile
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // University filter badge
                    Box {
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = SparklePurple.copy(alpha = 0.12f),
                            modifier = Modifier
                                .clickable { showUniMenu = true }
                                .testTag("university_filter_chip")
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = selectedUniversity ?: "All Campuses",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                )
                                Icon(
                                    imageVector = Icons.Default.ArrowDropDown,
                                    contentDescription = "Select University",
                                    tint = SparklePurple,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = showUniMenu,
                            onDismissRequest = { showUniMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("All Universities (Kenya)") },
                                onClick = {
                                    onSelectUniversity(null)
                                    showUniMenu = false
                                },
                                leadingIcon = {
                                    Icon(Icons.Default.Public, contentDescription = null, tint = SparklePurple)
                                }
                            )
                            universities.forEach { uni ->
                                DropdownMenuItem(
                                    text = { Text("${uni.shortName} - ${uni.name}") },
                                    onClick = {
                                        onSelectUniversity(uni.shortName)
                                        showUniMenu = false
                                    },
                                    leadingIcon = {
                                        Icon(Icons.Default.School, contentDescription = null, tint = SparklePurple)
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Search Toggle
                    IconButton(
                        onClick = onToggleSearch,
                        modifier = Modifier
                            .size(38.dp)
                            .testTag("search_toggle_button")
                    ) {
                        Icon(
                            imageVector = if (isSearchActive) Icons.Default.Close else Icons.Default.Search,
                            contentDescription = "Search",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Notifications Bell with Badge
                    IconButton(
                        onClick = onOpenNotifications,
                        modifier = Modifier
                            .size(38.dp)
                            .testTag("notifications_button")
                    ) {
                        BadgedBox(
                            badge = {
                                if (unreadNotificationCount > 0) {
                                    Badge(
                                        containerColor = SparklePink,
                                        contentColor = Color.White
                                    ) {
                                        Text("$unreadNotificationCount")
                                    }
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Notifications,
                                contentDescription = "Notifications",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(4.dp))

                    // Profile Avatar
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(SparkleSecondaryGradient)
                            .clickable { onOpenProfile() }
                            .testTag("profile_avatar_button"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = userAvatarInitial,
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }

            // Search Bar (Expands smoothly when active)
            AnimatedVisibility(visible = isSearchActive) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = { Text("Search posts, gigs, clubs, skills, or students...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SparklePurple) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchQueryChange("") }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = SparklePurple,
                        unfocusedBorderColor = SparkleBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                        .testTag("search_input_field")
                )
            }
        }
    }
}

@Composable
fun SparkleBottomNavigationBar(
    currentTab: SparkleTab,
    onTabSelected: (SparkleTab) -> Unit,
    unreadMessagesCount: Int,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier
            .windowInsetsPadding(WindowInsets.navigationBars)
            .testTag("main_bottom_nav"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 6.dp
    ) {
        SparkleTab.values().forEach { tab ->
            val isSelected = currentTab == tab
            val icon = when (tab) {
                SparkleTab.FEED -> if (isSelected) Icons.Filled.DynamicFeed else Icons.Outlined.DynamicFeed
                SparkleTab.GIGS -> if (isSelected) Icons.Filled.Work else Icons.Outlined.WorkOutline
                SparkleTab.COMMUNITIES -> if (isSelected) Icons.Filled.Groups else Icons.Outlined.Groups
                SparkleTab.EVENTS -> if (isSelected) Icons.Filled.Event else Icons.Outlined.Event
                SparkleTab.MESSAGES -> if (isSelected) Icons.Filled.ChatBubble else Icons.Outlined.ChatBubbleOutline
            }

            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tab) },
                icon = {
                    if (tab == SparkleTab.MESSAGES && unreadMessagesCount > 0) {
                        BadgedBox(
                            badge = {
                                Badge(
                                    containerColor = SparklePink,
                                    contentColor = Color.White
                                ) {
                                    Text("$unreadMessagesCount")
                                }
                            }
                        ) {
                            Icon(icon, contentDescription = tab.label)
                        }
                    } else {
                        Icon(icon, contentDescription = tab.label)
                    }
                },
                label = {
                    Text(
                        text = tab.label,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = SparklePurple,
                    selectedTextColor = SparklePurple,
                    indicatorColor = SparklePurple.copy(alpha = 0.14f),
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                modifier = Modifier.testTag("nav_item_${tab.name.lowercase()}")
            )
        }
    }
}

@Composable
fun SparkleNavBottomBar(
    currentRoute: String?,
    onNavigate: (com.example.ui.navigation.Screen) -> Unit,
    unreadMessagesCount: Int,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier
            .windowInsetsPadding(WindowInsets.navigationBars)
            .testTag("main_bottom_nav"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 6.dp
    ) {
        com.example.ui.navigation.Screen.bottomNavItems.forEach { screen ->
            val isSelected = currentRoute == screen.route
            val icon = if (isSelected) screen.selectedIcon else screen.unselectedIcon

            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(screen) },
                icon = {
                    if (screen == com.example.ui.navigation.Screen.Messages && unreadMessagesCount > 0) {
                        BadgedBox(
                            badge = {
                                Badge(
                                    containerColor = SparklePink,
                                    contentColor = Color.White
                                ) {
                                    Text("$unreadMessagesCount")
                                }
                            }
                        ) {
                            Icon(icon, contentDescription = screen.title)
                        }
                    } else {
                        Icon(icon, contentDescription = screen.title)
                    }
                },
                label = {
                    Text(
                        text = screen.title,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = SparklePurple,
                    selectedTextColor = SparklePurple,
                    indicatorColor = SparklePurple.copy(alpha = 0.14f),
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                modifier = Modifier.testTag("nav_item_${screen.route}")
            )
        }
    }
}
