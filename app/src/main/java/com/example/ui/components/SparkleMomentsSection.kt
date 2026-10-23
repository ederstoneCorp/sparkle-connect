package com.example.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.example.data.model.MomentAudience
import com.example.data.model.SparkleMoment
import com.example.data.model.StudentProfile
import com.example.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SparkleMomentsSection(
    moments: List<SparkleMoment>,
    currentUser: StudentProfile?,
    onMomentClick: (SparkleMoment) -> Unit,
    onCreateMomentClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .testTag("sparkle_moments_section")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp, vertical = 2.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "Sparkle Moments",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = SparklePurple.copy(alpha = 0.12f)
                ) {
                    Text(
                        text = "24h Visuals",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = SparklePurple,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        ),
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
            Text(
                text = "${moments.size} active",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(horizontal = 4.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.testTag("sparkle_moments_row")
        ) {
            // "Your Story" / Add Moment (Instagram Circular Style)
            item {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable { onCreateMomentClick() }
                        .testTag("add_sparkle_moment_card")
                ) {
                    Box(
                        modifier = Modifier.size(72.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        // User Avatar
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(SparklePrimaryGradient),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = currentUser?.displayName?.split(" ")?.mapNotNull { it.firstOrNull() }?.take(2)?.joinToString("") ?: "+",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }

                        // Blue plus badge at bottom end
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .offset(x = 2.dp, y = 2.dp)
                                .size(24.dp)
                                .border(2.dp, MaterialTheme.colorScheme.surface, CircleShape)
                                .clip(CircleShape)
                                .background(SparkleBlue),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Add Story",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Your Story",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        ),
                        maxLines = 1
                    )
                }
            }

            // Active Campus Moments (Instagram Circular Stories with Purple-Maroon-Blue gradient ring)
            items(moments, key = { it.id }) { moment ->
                val ringBrush = if (!moment.isViewedByMe) {
                    SparkleStoryRingGradient
                } else {
                    androidx.compose.ui.graphics.SolidColor(SparkleBorder)
                }

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable { onMomentClick(moment) }
                        .testTag("moment_item_${moment.id}")
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .border(2.5.dp, ringBrush, CircleShape)
                            .padding(4.dp)
                            .clip(CircleShape)
                            .background(
                                Color(
                                    try {
                                        android.graphics.Color.parseColor(moment.backgroundColorHex.ifBlank { "#6B21A8" })
                                    } catch (_: Exception) {
                                        0xFF6B21A8.toInt()
                                    }
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        if (!moment.mediaUri.isNullOrBlank()) {
                            AsyncImage(
                                model = moment.mediaUri,
                                contentDescription = moment.textCaption,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        } else {
                            Text(
                                text = moment.authorAvatar.take(2),
                                style = MaterialTheme.typography.titleMedium.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = moment.authorName.split(" ").firstOrNull() ?: moment.authorName,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = if (!moment.isViewedByMe) FontWeight.Bold else FontWeight.Normal,
                            color = MaterialTheme.colorScheme.onSurface
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun MomentViewerDialog(
    moment: SparkleMoment,
    momentsList: List<SparkleMoment>,
    currentUser: StudentProfile?,
    onDismiss: () -> Unit,
    onDeleteMoment: (String) -> Unit,
    onSendReaction: (String, String) -> Unit = { _, _ -> }
) {
    val currentIndex = momentsList.indexOfFirst { it.id == moment.id }.coerceAtLeast(0)
    var activeMoment by remember(moment) { mutableStateOf(moment) }
    val progress = remember { Animatable(0f) }
    var reactionSentMessage by remember { mutableStateOf<String?>(null) }
    var replyText by remember { mutableStateOf("") }
    val isAuthor = currentUser != null && activeMoment.authorId == currentUser.id

    // Auto-advance progress animation (5 seconds per moment)
    LaunchedEffect(activeMoment.id) {
        progress.snapTo(0f)
        progress.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 5000, easing = LinearEasing)
        )
        // Advance to next moment or dismiss
        val nextIdx = momentsList.indexOfFirst { it.id == activeMoment.id } + 1
        if (nextIdx < momentsList.size) {
            activeMoment = momentsList[nextIdx]
        } else {
            onDismiss()
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
                .testTag("sparkle_moment_viewer_dialog")
        ) {
            // Background Image or Gradient
            val bgParsedColor = try {
                Color(android.graphics.Color.parseColor(activeMoment.backgroundColorHex))
            } catch (_: Exception) {
                SparklePurple
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(bgParsedColor, Color(0xFF0F0B1E), Color.Black)
                        )
                    )
            ) {
                if (!activeMoment.mediaUri.isNullOrBlank()) {
                    AsyncImage(
                        model = activeMoment.mediaUri,
                        contentDescription = "Moment Media",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.4f))
                    )
                }

                // Central Large Text / Story Thought
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 28.dp, vertical = 120.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = activeMoment.textCaption,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            lineHeight = 34.sp
                        )
                    )
                }
            }

            // Navigation Tap Detectors (Left half = Previous, Right half = Next)
            Row(modifier = Modifier.fillMaxSize()) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .clickable {
                            val prevIdx = momentsList.indexOfFirst { it.id == activeMoment.id } - 1
                            if (prevIdx >= 0) {
                                activeMoment = momentsList[prevIdx]
                            }
                        }
                )
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .clickable {
                            val nextIdx = momentsList.indexOfFirst { it.id == activeMoment.id } + 1
                            if (nextIdx < momentsList.size) {
                                activeMoment = momentsList[nextIdx]
                            } else {
                                onDismiss()
                            }
                        }
                )
            }

            // Top Header: Progress Bar & Author Information
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                // Segmented Progress Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    momentsList.forEachIndexed { index, m ->
                        val itemProgress = when {
                            index < currentIndex -> 1f
                            index == currentIndex -> progress.value
                            else -> 0f
                        }
                        LinearProgressIndicator(
                            progress = { itemProgress },
                            modifier = Modifier
                                .weight(1f)
                                .height(3.dp)
                                .clip(RoundedCornerShape(2.dp)),
                            color = Color.White,
                            trackColor = Color.White.copy(alpha = 0.3f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Author Info Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(SparklePrimaryGradient),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = activeMoment.authorAvatar.take(2),
                            style = MaterialTheme.typography.titleSmall.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = activeMoment.authorName,
                                style = MaterialTheme.typography.titleSmall.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = SparklePurple.copy(alpha = 0.4f)
                            ) {
                                Text(
                                    text = activeMoment.authorUniversity,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontSize = 10.sp
                                    ),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = "Sparkle Moment • 24h",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Color.White.copy(alpha = 0.7f),
                                fontSize = 11.sp
                            )
                        )
                    }

                    if (isAuthor) {
                        IconButton(
                            onClick = {
                                onDeleteMoment(activeMoment.id)
                                onDismiss()
                            },
                            modifier = Modifier.testTag("delete_my_moment_button")
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete Moment", tint = SparklePink)
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                    }
                }
            }

            // Bottom Floating Controls: Reactions, Viewer count, and Reply
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            ) {
                // Reaction notification banner
                AnimatedVisibility(visible = reactionSentMessage != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color.Black.copy(alpha = 0.7f),
                        border = BorderStroke(1.dp, SparkleMint.copy(alpha = 0.5f)),
                        modifier = Modifier
                            .align(Alignment.CenterHorizontally)
                            .padding(bottom = 8.dp)
                    ) {
                        Text(
                            text = reactionSentMessage ?: "",
                            style = MaterialTheme.typography.labelMedium.copy(color = SparkleMint),
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }

                // Quick Reactions Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    val emojis = listOf("❤️", "🔥", "👏", "🎓", "✨", "🇰🇪")
                    emojis.forEach { emoji ->
                        Surface(
                            shape = CircleShape,
                            color = Color.White.copy(alpha = 0.2f),
                            modifier = Modifier
                                .size(40.dp)
                                .clickable {
                                    onSendReaction(activeMoment.id, emoji)
                                    reactionSentMessage = "Sent $emoji to ${activeMoment.authorName}"
                                }
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = emoji, fontSize = 20.sp)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Reply TextField
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = replyText,
                        onValueChange = { replyText = it },
                        placeholder = { Text("Send reply to ${activeMoment.authorName}...", color = Color.White.copy(alpha = 0.6f)) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = SparklePurple,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                            cursorColor = SparklePink
                        ),
                        singleLine = true,
                        shape = RoundedCornerShape(24.dp),
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    IconButton(
                        onClick = {
                            if (replyText.isNotBlank()) {
                                onSendReaction(activeMoment.id, replyText)
                                reactionSentMessage = "Reply sent!"
                                replyText = ""
                            }
                        },
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(SparklePurple)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(20.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun CreateSparkleMomentDialog(
    onDismiss: () -> Unit,
    onSubmit: (caption: String, mediaUri: String?, bgHex: String, audience: MomentAudience) -> Unit
) {
    var caption by remember { mutableStateOf("") }
    var selectedColor by remember { mutableStateOf("#6C3BFF") }
    var selectedAudience by remember { mutableStateOf(MomentAudience.PUBLIC) }
    var selectedMediaUri by remember { mutableStateOf<Uri?>(null) }

    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            selectedMediaUri = uri
        }
    }

    val palette = listOf("#6C3BFF", "#FF3366", "#FF6D00", "#00BFA5", "#0091EA", "#212121")

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = SparklePurple)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Sparkle Moment", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Share a 24-hour visual update with your campus community.",
                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = caption,
                    onValueChange = { caption = it },
                    placeholder = { Text("What's happening on campus right now? Add a thought...") },
                    minLines = 3,
                    maxLines = 5,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("create_moment_caption_input")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Media picker button
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, SparkleBorder.copy(alpha = 0.6f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            photoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (selectedMediaUri != null) Icons.Default.CheckCircle else Icons.Default.AddPhotoAlternate,
                            contentDescription = null,
                            tint = if (selectedMediaUri != null) SparkleMint else SparklePurple
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (selectedMediaUri != null) "Photo Attached" else "Attach Photo from Gallery",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = if (selectedMediaUri != null) "Tap to change photo" else "Uses Android Photo Picker",
                                style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                            )
                        }
                        if (selectedMediaUri != null) {
                            IconButton(onClick = { selectedMediaUri = null }) {
                                Icon(Icons.Default.Close, contentDescription = "Remove photo", tint = SparklePink)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Color Palette
                Text("Background Style", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    palette.forEach { hex ->
                        val isSelected = hex == selectedColor
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(Color(android.graphics.Color.parseColor(hex)))
                                .border(
                                    width = if (isSelected) 3.dp else 1.dp,
                                    color = if (isSelected) Color.White else Color.Transparent,
                                    shape = CircleShape
                                )
                                .clickable { selectedColor = hex }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Audience Selector
                Text("Audience Visibility", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MomentAudience.values().forEach { aud ->
                        val isSelected = aud == selectedAudience
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedAudience = aud },
                            label = {
                                Text(
                                    text = when (aud) {
                                        MomentAudience.PUBLIC -> "Public 🌍"
                                        MomentAudience.CONNECTIONS_ONLY -> "Connections 👥"
                                        MomentAudience.CAMPUS_ONLY -> "Campus Only 🏛️"
                                    },
                                    fontSize = 11.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SparklePurple,
                                selectedLabelColor = Color.White
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (caption.isNotBlank() || selectedMediaUri != null) {
                        onSubmit(
                            caption.ifBlank { "✨ Campus Sparkle Moment" },
                            selectedMediaUri?.toString(),
                            selectedColor,
                            selectedAudience
                        )
                    }
                },
                enabled = caption.isNotBlank() || selectedMediaUri != null,
                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.testTag("submit_sparkle_moment_button")
            ) {
                Text("Post Moment (24h)")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
