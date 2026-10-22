package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloat
import androidx.compose.foundation.BorderStroke
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
    onOpenCampusAiSearch: () -> Unit,
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

                // Action controls: Uni Filter, AI Search, Search, Notifs, Profile
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

                    Spacer(modifier = Modifier.width(4.dp))

                    // AI Campus Search Button
                    IconButton(
                        onClick = onOpenCampusAiSearch,
                        modifier = Modifier
                            .size(38.dp)
                            .testTag("ai_campus_search_header_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = "AI Campus Search",
                            tint = SparklePurple
                        )
                    }

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
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = onSearchQueryChange,
                        placeholder = { Text("Search posts, gigs, clubs, skills, or students...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SparklePurple) },
                        trailingIcon = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                if (searchQuery.isNotEmpty()) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(16.dp),
                                        strokeWidth = 2.dp,
                                        color = SparklePurple
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    IconButton(onClick = { onSearchQueryChange("") }) {
                                        Icon(Icons.Default.Clear, contentDescription = "Clear")
                                    }
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
                            .testTag("search_input_field")
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = SparklePurple.copy(alpha = 0.12f),
                        border = BorderStroke(1.dp, SparklePurple.copy(alpha = 0.3f)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onOpenCampusAiSearch() }
                            .testTag("ai_campus_search_trigger_chip")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = SparklePurple,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (searchQuery.isNotBlank()) "Search '$searchQuery' with Google Grounding 🌐✨" else "Search University Areas & Campuses with Google AI 🌐✨",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = null,
                                tint = SparklePurple,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
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

@Composable
fun LeftNavigationSidebar(
    currentUser: StudentProfile?,
    currentRoute: String?,
    onNavigate: (com.example.ui.navigation.Screen) -> Unit,
    onOpenProfile: () -> Unit,
    unreadMessagesCount: Int,
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Profile Card at top
            currentUser?.let { user ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onOpenProfile() }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(SparklePrimaryGradient),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = user.displayName.split(" ").mapNotNull { it.firstOrNull() }.take(2).joinToString(""),
                                style = MaterialTheme.typography.titleMedium.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = user.displayName,
                                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = user.university.shortName,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = SparklePurple,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "FEEDS & HUB",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                ),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Navigation items list
            com.example.ui.navigation.Screen.bottomNavItems.forEach { screen ->
                val isSelected = currentRoute == screen.route
                val icon = if (isSelected) screen.selectedIcon else screen.unselectedIcon

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSelected) SparklePurple.copy(alpha = 0.12f) else Color.Transparent,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp)
                        .clickable { onNavigate(screen) }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = screen.title,
                            tint = if (isSelected) SparklePurple else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = screen.title,
                            style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) SparklePurple else MaterialTheme.colorScheme.onSurface
                            ),
                            modifier = Modifier.weight(1f)
                        )
                        if (screen == com.example.ui.navigation.Screen.Messages && unreadMessagesCount > 0) {
                            Surface(
                                shape = CircleShape,
                                color = SparklePink
                            ) {
                                Text(
                                    text = "$unreadMessagesCount",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp
                                    ),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "COMMUNITY SHORTCUTS",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                ),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )

            Spacer(modifier = Modifier.height(6.dp))

            listOf(
                "Nairobi Tech Developers" to "💻",
                "Kenya FinTech Innovators" to "💳",
                "Campus Freelancers Network" to "⚡"
            ).forEach { (name, emoji) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = emoji, fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = name,
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun RightSecondaryWidgetsSidebar(
    gigs: List<Gig>,
    events: List<CampusEvent>,
    communities: List<Community>,
    onOpenGig: (Gig) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Trending Campus Gigs Widget
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Trending Campus Gigs",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Icon(Icons.Default.Work, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    gigs.take(2).forEach { gig ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surface,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable { onOpenGig(gig) }
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(
                                    text = gig.title,
                                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${gig.compensation} • ${gig.publisherUniversity}",
                                    style = MaterialTheme.typography.labelSmall.copy(color = SparklePurple, fontSize = 11.sp)
                                )
                            }
                        }
                    }
                }
            }

            // Upcoming Events Widget
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Upcoming Campus Events",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Icon(Icons.Default.Event, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    events.take(2).forEach { ev ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surface,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(
                                    text = ev.title,
                                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${ev.dateString} • ${ev.venue}",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Online Campus Peers
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "Online Campus Friends 🟢",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    listOf(
                        "Brian Mutua" to "UoN Chiromo",
                        "Faith Chebet" to "Strathmore",
                        "Dennis Mwangi" to "KU Kahawa"
                    ).forEach { (name, uni) ->
                        Row(
                            modifier = Modifier.padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(SparkleMint)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "$name ($uni)",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SkeletonShimmerCard(modifier: Modifier = Modifier) {
    val transition = androidx.compose.animation.core.rememberInfiniteTransition(label = "shimmer")
    val alphaAnim by transition.animateFloat(
        initialValue = 0.25f,
        targetValue = 0.75f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(durationMillis = 900, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = androidx.compose.animation.core.RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(Color.Gray.copy(alpha = alphaAnim))
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Box(
                        modifier = Modifier
                            .height(14.dp)
                            .fillMaxWidth(0.5f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color.Gray.copy(alpha = alphaAnim))
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Box(
                        modifier = Modifier
                            .height(10.dp)
                            .fillMaxWidth(0.3f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color.Gray.copy(alpha = alphaAnim))
                    )
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
            Box(
                modifier = Modifier
                    .height(14.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
            Spacer(modifier = Modifier.height(8.dp))
            Box(
                modifier = Modifier
                    .height(14.dp)
                    .fillMaxWidth(0.8f)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
        }
    }
}

@Composable
fun GigShimmerItem(modifier: Modifier = Modifier) {
    val transition = androidx.compose.animation.core.rememberInfiniteTransition(label = "shimmer_gig")
    val alphaAnim by transition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.7f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(durationMillis = 850, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = androidx.compose.animation.core.RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .height(18.dp)
                        .fillMaxWidth(0.6f)
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color.Gray.copy(alpha = alphaAnim))
                )
                Box(
                    modifier = Modifier
                        .height(24.dp)
                        .width(70.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.Gray.copy(alpha = alphaAnim))
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Box(
                modifier = Modifier
                    .height(12.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
            Spacer(modifier = Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .height(12.dp)
                    .fillMaxWidth(0.75f)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                repeat(3) {
                    Box(
                        modifier = Modifier
                            .height(20.dp)
                            .width(55.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.Gray.copy(alpha = alphaAnim))
                    )
                }
            }
        }
    }
}

@Composable
fun CommunityShimmerItem(modifier: Modifier = Modifier) {
    val transition = androidx.compose.animation.core.rememberInfiniteTransition(label = "shimmer_comm")
    val alphaAnim by transition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.7f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(durationMillis = 850, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = androidx.compose.animation.core.RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(14.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Box(
                    modifier = Modifier
                        .height(16.dp)
                        .fillMaxWidth(0.5f)
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color.Gray.copy(alpha = alphaAnim))
                )
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .height(12.dp)
                        .fillMaxWidth(0.8f)
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color.Gray.copy(alpha = alphaAnim))
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .height(32.dp)
                    .width(70.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.Gray.copy(alpha = alphaAnim))
            )
        }
    }
}

