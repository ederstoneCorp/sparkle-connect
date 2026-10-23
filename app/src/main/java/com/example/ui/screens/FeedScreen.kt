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
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.*
import com.example.ui.components.FullScreenImageViewerDialog
import com.example.ui.components.MomentViewerDialog
import com.example.ui.components.SparkleMomentsSection
import com.example.ui.theme.*

@Composable
fun FeedScreen(
    posts: List<CampusPost>,
    moments: List<SparkleMoment> = emptyList(),
    currentUser: StudentProfile? = null,
    selectedCategory: PostCategory,
    onSelectCategory: (PostCategory) -> Unit,
    onLikePost: (String) -> Unit,
    onAddComment: (String, String) -> Unit,
    onCreatePostClick: () -> Unit,
    onCreateMomentClick: () -> Unit = {},
    onDeletePost: (String) -> Unit = {},
    onUpdateCaption: (String, String) -> Unit = { _, _ -> },
    onToggleSavePost: (String) -> Unit = {},
    onToggleCommentsDisabled: (String) -> Unit = {},
    onReportPost: (String, String) -> Unit = { _, _ -> },
    onBlockUser: (String) -> Unit = {},
    onDeleteComment: (String, String) -> Unit = { _, _ -> },
    onDeleteMoment: (String) -> Unit = {},
    onSendMomentReaction: (String, String) -> Unit = { _, _ -> },
    visiblePostLimit: Int = 3,
    isLoadingMore: Boolean = false,
    onLoadMorePosts: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var viewingMoment by remember { mutableStateOf<SparkleMoment?>(null) }
    var viewingImages by remember { mutableStateOf<List<String>?>(null) }
    var viewingImageIndex by remember { mutableIntStateOf(0) }

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

            // Dedicated Sparkle Moments Row (24-Hour Temporary Content)
            item {
                SparkleMomentsSection(
                    moments = moments,
                    currentUser = currentUser,
                    onMomentClick = { viewingMoment = it },
                    onCreateMomentClick = onCreateMomentClick
                )
            }

            // Quick Composer Card ("What's on your mind?")
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
                                Icon(Icons.Default.AddPhotoAlternate, contentDescription = null, tint = SparkleBlue, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Photos & Media", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                            }
                            Row(
                                modifier = Modifier.clickable { onCreateMomentClick() },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Campus Moment", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
                            }
                            Row(
                                modifier = Modifier.clickable { onCreatePostClick() },
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = SparkleMaroon, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Confidential", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold))
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
                                text = "Be the first student to spark a campus discussion or share photos!",
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
                        currentUser = currentUser,
                        onLikeClick = { onLikePost(post.id) },
                        onCommentSubmit = { text -> onAddComment(post.id, text) },
                        onImageClick = { images, index ->
                            viewingImages = images
                            viewingImageIndex = index
                        },
                        onDeletePost = { onDeletePost(post.id) },
                        onToggleSavePost = { onToggleSavePost(post.id) },
                        onToggleCommentsDisabled = { onToggleCommentsDisabled(post.id) },
                        onUpdateCaption = { newCaption -> onUpdateCaption(post.id, newCaption) },
                        onReportPost = { reason -> onReportPost(post.id, reason) },
                        onBlockUser = { onBlockUser(post.authorId) },
                        onDeleteComment = { commentId -> onDeleteComment(post.id, commentId) }
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

        // Fullscreen Sparkle Moment Viewer Dialog
        viewingMoment?.let { moment ->
            MomentViewerDialog(
                moment = moment,
                momentsList = moments,
                currentUser = currentUser,
                onDismiss = { viewingMoment = null },
                onDeleteMoment = {
                    onDeleteMoment(it)
                    viewingMoment = null
                },
                onSendReaction = onSendMomentReaction
            )
        }

        // Fullscreen Post Image Viewer Dialog
        viewingImages?.let { images ->
            FullScreenImageViewerDialog(
                images = images,
                initialIndex = viewingImageIndex,
                onDismiss = { viewingImages = null }
            )
        }
    }
}

@Composable
fun CampusPostCard(
    post: CampusPost,
    currentUser: StudentProfile?,
    onLikeClick: () -> Unit,
    onCommentSubmit: (String) -> Unit,
    onImageClick: (List<String>, Int) -> Unit,
    onDeletePost: () -> Unit,
    onToggleSavePost: () -> Unit,
    onToggleCommentsDisabled: () -> Unit,
    onUpdateCaption: (String) -> Unit,
    onReportPost: (String) -> Unit,
    onBlockUser: () -> Unit,
    onDeleteComment: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showComments by remember { mutableStateOf(false) }
    var commentInput by remember { mutableStateOf("") }
    var showOptionsMenu by remember { mutableStateOf(false) }
    var showEditCaptionDialog by remember { mutableStateOf(false) }
    var editedCaptionText by remember { mutableStateOf(post.content) }
    var showReportDialog by remember { mutableStateOf(false) }

    val isAuthor = currentUser != null && (post.authorId == currentUser.id || currentUser.id == "user_holdstone")

    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("post_card_${post.id}")
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Author row & 3-dots Options Menu
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Avatar (with photo support)
                if (!post.isAnonymous && post.authorAvatar.startsWith("http")) {
                    AsyncImage(
                        model = post.authorAvatar,
                        contentDescription = "Avatar",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                    )
                } else {
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
                                tint = SparkleBlue,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        if (post.isAnonymous) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = SparkleMaroon.copy(alpha = 0.12f)
                            ) {
                                Text(
                                    text = "Confidential",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SparkleMaroon,
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
                        // Post Visibility indicator
                        Text(
                            text = when (post.visibility) {
                                PostVisibility.PUBLIC -> " • 🌍"
                                PostVisibility.CAMPUS_COMMUNITY -> " • 🏛️"
                                PostVisibility.CONNECTIONS_ONLY -> " • 👥"
                                PostVisibility.PRIVATE -> " • 🔒"
                            },
                            style = MaterialTheme.typography.bodySmall
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

                // 3-dots Menu for Privacy & Interaction Controls
                Box {
                    IconButton(
                        onClick = { showOptionsMenu = true },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.MoreVert, contentDescription = "Post Options", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }

                    DropdownMenu(
                        expanded = showOptionsMenu,
                        onDismissRequest = { showOptionsMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text(if (post.isSavedByMe) "Remove from Bookmarks" else "Bookmark / Save Post") },
                            leadingIcon = {
                                Icon(
                                    if (post.isSavedByMe) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                                    contentDescription = null,
                                    tint = if (post.isSavedByMe) SparklePurple else MaterialTheme.colorScheme.onSurface
                                )
                            },
                            onClick = {
                                onToggleSavePost()
                                showOptionsMenu = false
                            }
                        )

                        if (isAuthor) {
                            DropdownMenuItem(
                                text = { Text("Edit Caption") },
                                leadingIcon = { Icon(Icons.Default.Edit, contentDescription = null) },
                                onClick = {
                                    editedCaptionText = post.content
                                    showEditCaptionDialog = true
                                    showOptionsMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(if (post.commentsDisabled) "Enable Comments" else "Disable Comments") },
                                leadingIcon = {
                                    Icon(
                                        if (post.commentsDisabled) Icons.Default.ChatBubble else Icons.Outlined.CommentsDisabled,
                                        contentDescription = null
                                    )
                                },
                                onClick = {
                                    onToggleCommentsDisabled()
                                    showOptionsMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Delete Post", color = SparklePink) },
                                leadingIcon = { Icon(Icons.Default.Delete, contentDescription = null, tint = SparklePink) },
                                onClick = {
                                    onDeletePost()
                                    showOptionsMenu = false
                                }
                            )
                        } else {
                            DropdownMenuItem(
                                text = { Text("Report Post") },
                                leadingIcon = { Icon(Icons.Outlined.Report, contentDescription = null, tint = SparkleOrange) },
                                onClick = {
                                    showReportDialog = true
                                    showOptionsMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Block @${post.authorName}", color = SparklePink) },
                                leadingIcon = { Icon(Icons.Default.Block, contentDescription = null, tint = SparklePink) },
                                onClick = {
                                    onBlockUser()
                                    showOptionsMenu = false
                                }
                            )
                        }
                    }
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

            // Multi-Image Post Display
            if (post.images.isNotEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                if (post.images.size == 1) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(210.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { onImageClick(post.images, 0) }
                    ) {
                        AsyncImage(
                            model = post.images[0],
                            contentDescription = "Post Image",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                } else {
                    val pagerState = rememberPagerState(pageCount = { post.images.size })
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(230.dp)
                            .clip(RoundedCornerShape(12.dp))
                    ) {
                        HorizontalPager(
                            state = pagerState,
                            modifier = Modifier.fillMaxSize()
                        ) { page ->
                            AsyncImage(
                                model = post.images[page],
                                contentDescription = "Post Image ${page + 1}",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clickable { onImageClick(post.images, page) }
                            )
                        }

                        // Badge showing current image index
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color.Black.copy(alpha = 0.65f),
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(8.dp)
                        ) {
                            Text(
                                text = "${pagerState.currentPage + 1} / ${post.images.size}",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                ),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = SparkleBorder.copy(alpha = 0.5f), thickness = 0.8.dp)
            Spacer(modifier = Modifier.height(8.dp))

            // Engagement row (Likes, Comments, Bookmark, Share)
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
                        tint = if (post.isLikedByMe) SparkleMaroon else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${post.likesCount}",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = if (post.isLikedByMe) FontWeight.Bold else FontWeight.Medium,
                            color = if (post.isLikedByMe) SparkleMaroon else MaterialTheme.colorScheme.onSurfaceVariant
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
                        imageVector = if (post.commentsDisabled) Icons.Outlined.CommentsDisabled else Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "Comments",
                        tint = if (post.commentsDisabled) SparkleMaroon else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (post.commentsDisabled) "Off" else "${post.commentsCount}",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                // Bookmark / Save Action
                IconButton(
                    onClick = onToggleSavePost,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = if (post.isSavedByMe) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                        contentDescription = "Save Post",
                        tint = if (post.isSavedByMe) SparklePurple else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
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

            // Instagram-style clean likes summary
            if (post.likesCount > 0) {
                Text(
                    text = if (post.likesCount == 1) "1 like" else "${post.likesCount} likes",
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    ),
                    modifier = Modifier.padding(start = 8.dp, top = 2.dp, bottom = 4.dp)
                )
            }

            // Expandable Comments Section
            AnimatedVisibility(visible = showComments) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp)
                ) {
                    HorizontalDivider(color = SparkleBorder.copy(alpha = 0.5f), thickness = 0.8.dp)
                    Spacer(modifier = Modifier.height(10.dp))

                    if (post.commentsDisabled) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Outlined.CommentsDisabled, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "Comments have been disabled for this post by the author.",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                            }
                        }
                    } else {
                        // Existing comments
                        if (post.comments.isEmpty()) {
                            Text(
                                text = "No comments yet. Be the first to join the conversation!",
                                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                                modifier = Modifier.padding(vertical = 6.dp)
                            )
                        } else {
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
                                            text = comment.authorAvatar.take(2),
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
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
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
                                                // Comment deletion if owner or post author
                                                if (isAuthor || (currentUser != null && comment.authorName == currentUser.displayName)) {
                                                    IconButton(
                                                        onClick = { onDeleteComment(comment.id) },
                                                        modifier = Modifier.size(24.dp)
                                                    ) {
                                                        Icon(Icons.Default.Close, contentDescription = "Delete comment", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(14.dp))
                                                    }
                                                }
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

    // Edit Caption Dialog
    if (showEditCaptionDialog) {
        AlertDialog(
            onDismissRequest = { showEditCaptionDialog = false },
            title = { Text("Edit Caption", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)) },
            text = {
                OutlinedTextField(
                    value = editedCaptionText,
                    onValueChange = { editedCaptionText = it },
                    minLines = 3,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        onUpdateCaption(editedCaptionText)
                        showEditCaptionDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple)
                ) {
                    Text("Save Caption")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditCaptionDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Report Post Dialog
    if (showReportDialog) {
        var reportReason by remember { mutableStateOf("Inappropriate Content") }
        AlertDialog(
            onDismissRequest = { showReportDialog = false },
            title = { Text("Report Post to Campus Moderation", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)) },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text("Select a violation reason:", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    listOf("Inappropriate Content", "Harassment or Bullying", "Spam", "Scams or Fraud", "Privacy Violation").forEach { reason ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { reportReason = reason }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(selected = reportReason == reason, onClick = { reportReason = reason })
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(reason, style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onReportPost(reportReason)
                        showReportDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePink)
                ) {
                    Text("Submit Report")
                }
            },
            dismissButton = {
                TextButton(onClick = { showReportDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
