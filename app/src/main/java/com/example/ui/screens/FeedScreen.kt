package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import com.example.data.model.CampusPost
import com.example.data.model.PostCategory
import com.example.ui.theme.*

@Composable
fun FeedScreen(
    posts: List<CampusPost>,
    selectedCategory: PostCategory,
    onSelectCategory: (PostCategory) -> Unit,
    onLikePost: (String) -> Unit,
    onAddComment: (String, String) -> Unit,
    onCreatePostClick: () -> Unit,
    visiblePostLimit: Int = 3,
    isLoadingMore: Boolean = false,
    onLoadMorePosts: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val displayedPosts = posts.take(visiblePostLimit)
    val hasMorePosts = posts.size > visiblePostLimit

    Box(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 14.dp),
            contentPadding = PaddingValues(top = 10.dp, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Category Filter Pills
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(vertical = 4.dp),
                    modifier = Modifier.testTag("feed_category_row")
                ) {
                    items(PostCategory.values()) { category ->
                        val isSelected = category == selectedCategory
                        FilterChip(
                            selected = isSelected,
                            onClick = { onSelectCategory(category) },
                            label = {
                                Text(
                                    text = category.displayName,
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SparklePurple,
                                selectedLabelColor = Color.White
                            ),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.testTag("filter_chip_${category.name.lowercase()}")
                        )
                    }
                }
            }

            // Campus Highlights / Stories Row (Facebook style)
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "Campus Highlights",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        contentPadding = PaddingValues(horizontal = 2.dp)
                    ) {
                        // Create Story Card
                        item {
                            Card(
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.6f)),
                                modifier = Modifier
                                    .width(100.dp)
                                    .height(130.dp)
                                    .clickable { onCreatePostClick() }
                            ) {
                                Column(
                                    modifier = Modifier.fillMaxSize(),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(CircleShape)
                                            .background(SparklePurple),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = null, tint = Color.White)
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "Add Story",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        fontSize = 11.sp
                                    )
                                }
                            }
                        }

                        // Sample Campus Highlight Cards
                        val campusStories = listOf(
                            "UoN Gala" to "UoN Chiromo",
                            "KU Hackathon" to "KU Kahawa",
                            "Strathmore" to "Strathmore",
                            "JKUAT Tech" to "JKUAT Juja"
                        )
                        items(campusStories) { (title, campus) ->
                            Card(
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                                border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.4f)),
                                modifier = Modifier
                                    .width(100.dp)
                                    .height(130.dp)
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .padding(8.dp),
                                    verticalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(28.dp)
                                            .clip(CircleShape)
                                            .background(SparklePrimaryGradient),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = title.take(1),
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                color = Color.White,
                                                fontWeight = FontWeight.Bold
                                            )
                                        )
                                    }
                                    Column {
                                        Text(
                                            text = title,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp
                                            ),
                                            maxLines = 1
                                        )
                                        Text(
                                            text = campus,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                color = SparklePurple,
                                                fontSize = 9.sp
                                            ),
                                            maxLines = 1
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Category Filter Pills
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(vertical = 4.dp),
                    modifier = Modifier.testTag("feed_category_row")
                ) {
                    items(PostCategory.values()) { category ->
                        val isSelected = category == selectedCategory
                        FilterChip(
                            selected = isSelected,
                            onClick = { onSelectCategory(category) },
                            label = {
                                Text(
                                    text = category.displayName,
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SparklePurple,
                                selectedLabelColor = Color.White
                            ),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.testTag("filter_chip_${category.name.lowercase()}")
                        )
                    }
                }
            }

            // Facebook-Style Composer Card ("What's on your mind?")
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.5f)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("quick_post_banner")
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onCreatePostClick() },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(SparklePrimaryGradient),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Edit, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Surface(
                                shape = RoundedCornerShape(24.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(
                                    text = "What's on your mind? Share an update...",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    ),
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = SparkleBorder.copy(alpha = 0.4f))
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceAround,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                modifier = Modifier.clickable { onCreatePostClick() },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Image, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Photo/Media", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                            }
                            Row(
                                modifier = Modifier.clickable { onCreatePostClick() },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = SparklePink, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Secret Post 🔒", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                            }
                            Row(
                                modifier = Modifier.clickable { onCreatePostClick() },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Work, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Gig Offer", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                            }
                        }
                    }
                }
            }

            // Empty State
            if (posts.isEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 30.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Forum,
                                contentDescription = null,
                                tint = SparklePurple,
                                modifier = Modifier.size(48.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "No posts in this category yet",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Be the first student to spark a discussion!",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = onCreatePostClick,
                                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("Create Post")
                            }
                        }
                    }
                }
            } else {
                items(displayedPosts, key = { it.id }) { post ->
                    CampusPostCard(
                        post = post,
                        onLikeClick = { onLikePost(post.id) },
                        onCommentSubmit = { text -> onAddComment(post.id, text) }
                    )
                }

                if (isLoadingMore) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            com.example.ui.components.SkeletonShimmerCard()
                            com.example.ui.components.SkeletonShimmerCard()
                        }
                    }
                } else if (hasMorePosts) {
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, SparklePurple.copy(alpha = 0.35f)),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp)
                                .testTag("load_more_posts_card")
                        ) {
                            Button(
                                onClick = onLoadMorePosts,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = SparklePurple,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp)
                                    .height(48.dp)
                                    .testTag("load_more_posts_button")
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.ExpandMore,
                                        contentDescription = "Load More Posts",
                                        modifier = Modifier.size(22.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Load More Campus Posts (${posts.size - visiblePostLimit} remaining)",
                                        style = MaterialTheme.typography.labelLarge.copy(
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    )
                                }
                            }
                        }
                    }
                } else if (posts.isNotEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                                border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.4f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "🎉 You're all caught up! No more posts.",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontWeight = FontWeight.Medium
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Floating Action Button
        FloatingActionButton(
            onClick = onCreatePostClick,
            containerColor = SparklePurple,
            contentColor = Color.White,
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 16.dp, bottom = 16.dp)
                .testTag("create_post_fab")
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Post")
                Spacer(modifier = Modifier.width(6.dp))
                Text("Post", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun CampusPostCard(
    post: CampusPost,
    onLikeClick: () -> Unit,
    onCommentSubmit: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showComments by remember { mutableStateOf(false) }
    var commentInput by remember { mutableStateOf("") }

    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("post_card_${post.id}")
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Author row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Avatar
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(
                            if (post.isAnonymous) androidx.compose.ui.graphics.SolidColor(SparkleDarkSurface) else SparkleSecondaryGradient
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = post.authorAvatar,
                        style = MaterialTheme.typography.titleMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = post.authorName,
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        if (post.isAuthorVerified && !post.isAnonymous) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Verified Student",
                                tint = SparkleMint,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        if (post.isAnonymous) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = SparklePink.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = "Confidential",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SparklePink,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp
                                    ),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = post.authorUniversity,
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                        Text(
                            text = " • ${post.timeAgo}",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }
                }

                // Category pill
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = SparklePurple.copy(alpha = 0.1f)
                ) {
                    Text(
                        text = post.category.displayName,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = SparklePurple,
                            fontWeight = FontWeight.SemiBold
                        ),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Post content
            Text(
                text = post.content,
                style = MaterialTheme.typography.bodyLarge.copy(
                    lineHeight = 22.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
            )

            Spacer(modifier = Modifier.height(14.dp))
            Divider(color = SparkleBorder.copy(alpha = 0.5f), thickness = 0.8.dp)
            Spacer(modifier = Modifier.height(8.dp))

            // Engagement row (Likes, Comments, Share)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Like Button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clickable { onLikeClick() }
                        .padding(horizontal = 8.dp, vertical = 6.dp)
                        .testTag("post_like_button_${post.id}")
                ) {
                    Icon(
                        imageVector = if (post.isLikedByMe) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (post.isLikedByMe) SparklePink else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${post.likesCount}",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = if (post.isLikedByMe) FontWeight.Bold else FontWeight.Medium,
                            color = if (post.isLikedByMe) SparklePink else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                // Comment Button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clickable { showComments = !showComments }
                        .padding(horizontal = 8.dp, vertical = 6.dp)
                        .testTag("post_comment_button_${post.id}")
                ) {
                    Icon(
                        imageVector = Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "Comments",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${post.commentsCount}",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                // Share Button
                IconButton(
                    onClick = { /* Share link */ },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Share,
                        contentDescription = "Share",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            // Expandable Comments Section
            AnimatedVisibility(visible = showComments) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp)
                ) {
                    Divider(color = SparkleBorder.copy(alpha = 0.5f), thickness = 0.8.dp)
                    Spacer(modifier = Modifier.height(10.dp))

                    // Existing comments
                    post.comments.forEach { comment ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(SparklePurple.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = comment.authorAvatar,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = comment.authorName,
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = comment.authorUniversity,
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 11.sp
                                            )
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = comment.content,
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                            }
                        }
                    }

                    // Comment input row
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = commentInput,
                            onValueChange = { commentInput = it },
                            placeholder = { Text("Write a comment...") },
                            singleLine = true,
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier
                                .weight(1f)
                                .testTag("post_comment_input_${post.id}")
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        IconButton(
                            onClick = {
                                if (commentInput.isNotBlank()) {
                                    onCommentSubmit(commentInput)
                                    commentInput = ""
                                }
                            },
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(SparklePurple)
                                .testTag("post_comment_submit_${post.id}")
                        ) {
                            Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}
