package com.example.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.example.data.model.CampusPost
import com.example.data.model.PostCategory
import com.example.data.model.PostVisibility
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnhancedCreatePostDialog(
    onDismiss: () -> Unit,
    onSubmit: (
        content: String,
        category: PostCategory,
        isAnonymous: Boolean,
        images: List<String>,
        visibility: PostVisibility,
        commentsDisabled: Boolean
    ) -> Unit
) {
    var content by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(PostCategory.CAMPUS_LIFE) }
    var isAnonymous by remember { mutableStateOf(false) }
    var selectedVisibility by remember { mutableStateOf(PostVisibility.CAMPUS_COMMUNITY) }
    var commentsDisabled by remember { mutableStateOf(false) }
    val selectedImageUris = remember { mutableStateListOf<String>() }
    var showVisibilityMenu by remember { mutableStateOf(false) }

    // Multi-Image Picker using Android Photo Picker (zero-permission standard)
    val multiplePhotoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxItems = 4)
    ) { uris: List<Uri> ->
        uris.forEach { uri ->
            val uriStr = uri.toString()
            if (!selectedImageUris.contains(uriStr) && selectedImageUris.size < 4) {
                selectedImageUris.add(uriStr)
            }
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Create Post",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                // Visibility Selector Chip
                Box {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = SparklePurple.copy(alpha = 0.12f),
                        border = BorderStroke(1.dp, SparklePurple.copy(alpha = 0.3f)),
                        modifier = Modifier.clickable { showVisibilityMenu = true }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = when (selectedVisibility) {
                                    PostVisibility.PUBLIC -> Icons.Default.Public
                                    PostVisibility.CAMPUS_COMMUNITY -> Icons.Default.School
                                    PostVisibility.CONNECTIONS_ONLY -> Icons.Default.People
                                    PostVisibility.PRIVATE -> Icons.Default.Lock
                                },
                                contentDescription = null,
                                tint = SparklePurple,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = when (selectedVisibility) {
                                    PostVisibility.PUBLIC -> "Public"
                                    PostVisibility.CAMPUS_COMMUNITY -> "Campus"
                                    PostVisibility.CONNECTIONS_ONLY -> "Connections"
                                    PostVisibility.PRIVATE -> "Only Me"
                                },
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = SparklePurple,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(16.dp))
                        }
                    }

                    DropdownMenu(
                        expanded = showVisibilityMenu,
                        onDismissRequest = { showVisibilityMenu = false }
                    ) {
                        PostVisibility.values().forEach { vis ->
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(
                                            text = when (vis) {
                                                PostVisibility.PUBLIC -> "Public 🌍"
                                                PostVisibility.CAMPUS_COMMUNITY -> "University Community 🏛️"
                                                PostVisibility.CONNECTIONS_ONLY -> "Connections Only 👥"
                                                PostVisibility.PRIVATE -> "Private / Only Me 🔒"
                                            },
                                            fontWeight = if (vis == selectedVisibility) FontWeight.Bold else FontWeight.Normal
                                        )
                                        Text(
                                            text = when (vis) {
                                                PostVisibility.PUBLIC -> "Visible to everyone across all campuses"
                                                PostVisibility.CAMPUS_COMMUNITY -> "Restricted to students in your university"
                                                PostVisibility.CONNECTIONS_ONLY -> "Visible to accepted connections only"
                                                PostVisibility.PRIVATE -> "Visible only to you"
                                            },
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 10.sp
                                            )
                                        )
                                    }
                                },
                                onClick = {
                                    selectedVisibility = vis
                                    showVisibilityMenu = false
                                }
                            )
                        }
                    }
                }
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = { Text("What's on your mind? Share news, questions, or ideas...") },
                    minLines = 3,
                    maxLines = 5,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("create_post_content_input")
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Multi-Image Preview Row
                if (selectedImageUris.isNotEmpty()) {
                    Text(
                        text = "Attached Photos (${selectedImageUris.size}/4):",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        itemsIndexed(selectedImageUris) { index, uriStr ->
                            Box(
                                modifier = Modifier
                                    .size(70.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .border(1.dp, SparkleBorder, RoundedCornerShape(10.dp))
                            ) {
                                AsyncImage(
                                    model = uriStr,
                                    contentDescription = "Post image $index",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                // Remove button
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(2.dp)
                                        .size(20.dp)
                                        .clip(CircleShape)
                                        .background(Color.Black.copy(alpha = 0.7f))
                                        .clickable { selectedImageUris.removeAt(index) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Remove photo",
                                        tint = Color.White,
                                        modifier = Modifier.size(14.dp)
                                    )
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }

                // Add Photo Action Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        onClick = {
                            multiplePhotoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        },
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, SparklePurple.copy(alpha = 0.5f)),
                        enabled = selectedImageUris.size < 4,
                        modifier = Modifier.testTag("pick_post_photos_button")
                    ) {
                        Icon(Icons.Default.AddPhotoAlternate, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (selectedImageUris.isEmpty()) "Add Photos (max 4)" else "Add More Photos",
                            color = SparklePurple,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Post Settings: Disable Comments Toggle
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.CommentsDisabled, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("Disable Comments", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                                Text("Turn off comments on this post", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant))
                            }
                        }
                        Switch(
                            checked = commentsDisabled,
                            onCheckedChange = { commentsDisabled = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = SparkleOrange,
                                checkedTrackColor = SparkleOrange.copy(alpha = 0.3f)
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Anonymous Mode Toggle
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (isAnonymous) SparklePink.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = if (isAnonymous) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = null,
                                tint = if (isAnonymous) SparklePink else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("Post Anonymously", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                                Text("Hides your name and campus identity", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant))
                            }
                        }
                        Switch(
                            checked = isAnonymous,
                            onCheckedChange = { isAnonymous = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = SparklePink,
                                checkedTrackColor = SparklePink.copy(alpha = 0.3f)
                            ),
                            modifier = Modifier.testTag("anonymous_toggle_switch")
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (content.isNotBlank() || selectedImageUris.isNotEmpty()) {
                        onSubmit(
                            content.ifBlank { "📸 Shared media update" },
                            selectedCategory,
                            isAnonymous,
                            selectedImageUris.toList(),
                            selectedVisibility,
                            commentsDisabled
                        )
                    }
                },
                enabled = content.isNotBlank() || selectedImageUris.isNotEmpty(),
                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.testTag("confirm_create_post_button")
            ) {
                Text("Publish Post")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun FullScreenImageViewerDialog(
    images: List<String>,
    initialIndex: Int = 0,
    onDismiss: () -> Unit
) {
    val pagerState = rememberPagerState(initialPage = initialIndex, pageCount = { images.size })
    val coroutineScope = rememberCoroutineScope()

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
                .testTag("fullscreen_image_viewer_dialog")
        ) {
            // Horizontal Pager with swipe between images
            HorizontalPager(
                state = pagerState,
                modifier = Modifier.fillMaxSize()
            ) { page ->
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    AsyncImage(
                        model = images[page],
                        contentDescription = "Full photo ${page + 1}",
                        contentScale = ContentScale.Fit,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }

            // Top Header: Counter and Close Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color.Black.copy(alpha = 0.6f)
                ) {
                    Text(
                        text = "${pagerState.currentPage + 1} / ${images.size}",
                        style = MaterialTheme.typography.labelMedium.copy(color = Color.White, fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.6f))
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                }
            }

            // Left/Right arrow hints if multiple images
            if (images.size > 1) {
                if (pagerState.currentPage > 0) {
                    IconButton(
                        onClick = {
                            coroutineScope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage - 1)
                            }
                        },
                        modifier = Modifier
                            .align(Alignment.CenterStart)
                            .padding(start = 12.dp)
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.5f))
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Previous Image", tint = Color.White)
                    }
                }

                if (pagerState.currentPage < images.size - 1) {
                    IconButton(
                        onClick = {
                            coroutineScope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage + 1)
                            }
                        },
                        modifier = Modifier
                            .align(Alignment.CenterEnd)
                            .padding(end = 12.dp)
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.5f))
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = "Next Image", tint = Color.White)
                    }
                }
            }
        }
    }
}
