package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileSheet(
    user: StudentProfile,
    universities: List<University>,
    firebaseUserEmail: String? = null,
    onSignInWithGoogle: () -> Unit = {},
    onSignOut: () -> Unit = {},
    onTakePhotoClick: () -> Unit = {},
    onDismiss: () -> Unit,
    onSaveProfile: (String, String, String, Int) -> Unit,
    onSwitchUniversity: (University) -> Unit
) {
    var isEditing by remember { mutableStateOf(false) }
    var bio by remember { mutableStateOf(user.bio) }
    var faculty by remember { mutableStateOf(user.faculty) }
    var course by remember { mutableStateOf(user.course) }
    var year by remember { mutableStateOf(user.yearOfStudy) }
    var showUniMenu by remember { mutableStateOf(false) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp)
                .navigationBarsPadding()
        ) {
            // Profile Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .clickable { onTakePhotoClick() }
                        .testTag("avatar_take_photo_button")
                ) {
                    Box(
                        modifier = Modifier
                            .size(68.dp)
                            .clip(CircleShape)
                            .background(SparklePrimaryGradient),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = user.displayName.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                            style = MaterialTheme.typography.titleLarge.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(SparklePurple)
                            .align(Alignment.BottomEnd),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = "Take Profile Photo",
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = user.displayName,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        if (user.isVerifiedStudent) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verified Campus Student",
                                tint = SparkleMint,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                    Text(
                        text = "@${user.username} • ${user.joinedDate}",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Text(
                        text = user.university.name,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = SparklePurple,
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Switch Campus Button
            OutlinedButton(
                onClick = { showUniMenu = true },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.SwapHoriz, contentDescription = null, tint = SparklePurple)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Campus: ${user.university.shortName} (Tap to Switch)", color = SparklePurple)

                DropdownMenu(
                    expanded = showUniMenu,
                    onDismissRequest = { showUniMenu = false }
                ) {
                    universities.forEach { uni ->
                        DropdownMenuItem(
                            text = { Text("${uni.shortName} - ${uni.name}") },
                            onClick = {
                                onSwitchUniversity(uni)
                                showUniMenu = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            if (isEditing) {
                OutlinedTextField(
                    value = bio,
                    onValueChange = { bio = it },
                    label = { Text("Bio") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = faculty,
                    onValueChange = { faculty = it },
                    label = { Text("Faculty / School") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = course,
                    onValueChange = { course = it },
                    label = { Text("Course of Study") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        onSaveProfile(bio, faculty, course, year)
                        isEditing = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Save Changes")
                }
            } else {
                Text(
                    text = user.bio,
                    style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 20.sp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "ACADEMIC DETAILS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "${user.course} (Year ${user.yearOfStudy})",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                        )
                        Text(
                            text = user.faculty,
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Skills & Expertise",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    user.skills.forEach { skill ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = SparkleMint.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = skill,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color(0xFF00583A),
                                    fontWeight = FontWeight.SemiBold
                                ),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = { isEditing = true },
                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Edit Profile")
                }

                Spacer(modifier = Modifier.height(14.dp))

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Security,
                                contentDescription = null,
                                tint = SparklePurple,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "STUDENT AUTHENTICATION",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (firebaseUserEmail != null)
                                "Signed in via Google: $firebaseUserEmail"
                            else
                                "Authenticate your account securely with your university Google account.",
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        if (firebaseUserEmail != null) {
                            OutlinedButton(
                                onClick = onSignOut,
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Sign Out", color = SparklePink, fontWeight = FontWeight.Bold)
                            }
                        } else {
                            Button(
                                onClick = onSignInWithGoogle,
                                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("google_sign_in_button")
                            ) {
                                Icon(Icons.Default.AccountCircle, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Sign in with Google", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun CreatePostDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, PostCategory, Boolean) -> Unit
) {
    var content by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(PostCategory.CAMPUS_LIFE) }
    var isAnonymous by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Create Campus Post",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = { Text("What's on your mind? Share opportunities, questions, or ideas...") },
                    minLines = 4,
                    maxLines = 6,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("create_post_content_input")
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Anonymous Mode Toggle
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isAnonymous) SparklePink.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (isAnonymous) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = null,
                            tint = if (isAnonymous) SparklePink else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Post Anonymously",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Hides your name & avatar from fellow students",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 10.sp
                                )
                            )
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
                    if (content.isNotBlank()) {
                        onSubmit(content, selectedCategory, isAnonymous)
                    }
                },
                enabled = content.isNotBlank(),
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
fun ApplyGigDialog(
    gig: Gig,
    onDismiss: () -> Unit,
    onSubmit: (String, String, String) -> Unit
) {
    var coverNote by remember { mutableStateOf("") }
    var portfolioLink by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text("Apply for Opportunity", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                Text(gig.title, style = MaterialTheme.typography.bodySmall.copy(color = SparklePurple))
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = SparkleMint.copy(alpha = 0.12f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Compensation: ${gig.compensation} • ${gig.opportunityType.label}",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color(0xFF007A50),
                            fontWeight = FontWeight.Bold
                        ),
                        modifier = Modifier.padding(10.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = coverNote,
                    onValueChange = { coverNote = it },
                    label = { Text("Why are you a great fit?") },
                    placeholder = { Text("Mention your experience, availability, or past work...") },
                    minLines = 3,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = portfolioLink,
                    onValueChange = { portfolioLink = it },
                    label = { Text("Portfolio / GitHub / Drive link") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("M-Pesa / Phone Number (Optional)") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (coverNote.isNotBlank()) {
                        onSubmit(coverNote, portfolioLink, phone)
                    }
                },
                enabled = coverNote.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.testTag("submit_gig_application_button")
            ) {
                Text("Send Application")
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
fun CreateGigDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, String, String, List<String>, GigOpportunityType, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Tech & Development") }
    var compensation by remember { mutableStateOf("KES 5,000") }
    var skillsInput by remember { mutableStateOf("Kotlin, Design") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Publish Student Gig", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Gig Title") },
                    placeholder = { Text("e.g., Campus Event Poster Design") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description & Requirements") },
                    minLines = 3,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = compensation,
                    onValueChange = { compensation = it },
                    label = { Text("Compensation") },
                    placeholder = { Text("e.g., KES 10,000 or KES 500/hr") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = skillsInput,
                    onValueChange = { skillsInput = it },
                    label = { Text("Required Skills (comma separated)") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank() && description.isNotBlank()) {
                        val skills = skillsInput.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                        onSubmit(title, description, category, skills, GigOpportunityType.FREELANCE, compensation)
                    }
                },
                enabled = title.isNotBlank() && description.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = SparklePink),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Post Gig")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsSheet(
    notifications: List<SparkleNotification>,
    onDismiss: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(),
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .navigationBarsPadding()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Notifications",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
                Text(
                    text = "${notifications.size} recent",
                    style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(notifications, key = { it.id }) { notif ->
                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            val icon = when (notif.type) {
                                "gig" -> Icons.Default.Work
                                "event" -> Icons.Default.Event
                                "community" -> Icons.Default.Groups
                                else -> Icons.Default.Notifications
                            }
                            val tint = when (notif.type) {
                                "gig" -> SparklePink
                                "event" -> SparkleMint
                                "community" -> SparkleBlue
                                else -> SparklePurple
                            }

                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .clip(CircleShape)
                                    .background(tint.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
                            }

                            Spacer(modifier = Modifier.width(10.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = notif.title,
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = notif.body,
                                    style = MaterialTheme.typography.bodySmall.copy(lineHeight = 16.sp)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = notif.timeAgo,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 10.sp
                                    )
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
