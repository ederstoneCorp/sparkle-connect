package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Gig
import com.example.data.model.GigApplication
import com.example.data.model.GigOpportunityType
import com.example.ui.viewmodel.GigViewTab
import com.example.ui.theme.*

@Composable
fun GigsScreen(
    gigs: List<Gig>,
    selectedCategory: String,
    onSelectCategory: (String) -> Unit,
    onBookmarkToggle: (String) -> Unit,
    onApplyClick: (Gig) -> Unit,
    onCreateGigClick: () -> Unit,
    selectedViewTab: GigViewTab = GigViewTab.EXPLORE,
    onSelectViewTab: (GigViewTab) -> Unit = {},
    appliedApplications: List<GigApplication> = emptyList(),
    isLoading: Boolean = false,
    modifier: Modifier = Modifier
) {
    val categories = listOf("All", "Mobile & App", "Design", "Tutoring", "Event", "Writing")

    Box(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 14.dp),
            contentPadding = PaddingValues(top = 10.dp, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header Banner
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = SparklePurple),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Student Gig Hub 💼",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color.White.copy(alpha = 0.2f)
                            ) {
                                Text(
                                    text = "Earn & Learn",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.SemiBold
                                    ),
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Find freelance campus projects, peer tutoring requests, part-time jobs, and collaboration roles across Kenya universities.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Color.White.copy(alpha = 0.9f),
                                lineHeight = 18.sp
                            )
                        )
                    }
                }
            }

            // View Tabs Row: Explore vs Applied
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = selectedViewTab == GigViewTab.EXPLORE,
                        onClick = { onSelectViewTab(GigViewTab.EXPLORE) },
                        label = { Text("Explore Gigs (${gigs.size})") },
                        shape = RoundedCornerShape(20.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = SparklePurple,
                            selectedLabelColor = Color.White
                        )
                    )
                    FilterChip(
                        selected = selectedViewTab == GigViewTab.APPLIED,
                        onClick = { onSelectViewTab(GigViewTab.APPLIED) },
                        label = { Text("Applied Gigs (${appliedApplications.size}) 🎉") },
                        shape = RoundedCornerShape(20.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = SparklePurple,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            if (selectedViewTab == GigViewTab.EXPLORE) {
                // Categories Row
                item {
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        contentPadding = PaddingValues(vertical = 4.dp),
                        modifier = Modifier.testTag("gigs_category_row")
                    ) {
                        items(categories) { cat ->
                            val isSelected = cat == selectedCategory
                            FilterChip(
                                selected = isSelected,
                                onClick = { onSelectCategory(cat) },
                                label = {
                                    Text(
                                        text = cat,
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                        )
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = SparklePink,
                                    selectedLabelColor = Color.White
                                ),
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.testTag("gig_filter_$cat")
                            )
                        }
                    }
                }

                // Gigs List
                if (isLoading) {
                    items(3) {
                        com.example.ui.components.GigShimmerItem()
                    }
                } else if (gigs.isEmpty()) {
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 20.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Outlined.WorkOutline, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(44.dp))
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = "No gigs found for this category",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Have a project you need help with? Post an opportunity!",
                                    style = MaterialTheme.typography.bodyMedium.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                Button(
                                    onClick = onCreateGigClick,
                                    colors = ButtonDefaults.buttonColors(containerColor = SparklePink),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Post a Gig")
                                }
                            }
                        }
                    }
                } else {
                    items(gigs, key = { it.id }) { gig ->
                        GigCardItem(
                            gig = gig,
                            onBookmarkToggle = { onBookmarkToggle(gig.id) },
                            onApplyClick = { onApplyClick(gig) }
                        )
                    }
                }
            } else {
                // Applied Gigs Section
                if (appliedApplications.isEmpty()) {
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 20.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Outlined.Description, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(44.dp))
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = "No Gig Applications Yet",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Explore open campus gigs and send your pitch to start earning KES.",
                                    style = MaterialTheme.typography.bodyMedium.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                Button(
                                    onClick = { onSelectViewTab(GigViewTab.EXPLORE) },
                                    colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Explore Gigs")
                                }
                            }
                        }
                    }
                } else {
                    items(appliedApplications, key = { it.id }) { app ->
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = SparkleMint.copy(alpha = 0.2f)
                                    ) {
                                        Text(
                                            text = "● Status: ${app.status}",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                color = Color(0xFF047857),
                                                fontWeight = FontWeight.Bold
                                            ),
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.weight(1f))
                                    Text(
                                        text = app.submittedAt,
                                        style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    )
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Pitch Note:",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                                Text(
                                    text = "\"${app.coverNote}\"",
                                    style = MaterialTheme.typography.bodySmall.copy(fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Phone: ${app.phone}",
                                    style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun GigCardItem(
    gig: Gig,
    onBookmarkToggle: () -> Unit,
    onApplyClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = SparklePurple.copy(alpha = 0.1f)
                ) {
                    Text(
                        text = gig.compensation,
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = SparklePurple,
                            fontWeight = FontWeight.Bold
                        ),
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
                Spacer(modifier = Modifier.weight(1f))
                IconButton(onClick = onBookmarkToggle) {
                    Icon(
                        imageVector = if (gig.isBookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                        contentDescription = "Bookmark",
                        tint = if (gig.isBookmarked) SparklePink else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = gig.title,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = gig.description,
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                maxLines = 3
            )

            Spacer(modifier = Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "${gig.publisherName} • ${gig.publisherUniversity}",
                    style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )
                Spacer(modifier = Modifier.weight(1f))
                if (gig.hasApplied) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFF10B981).copy(alpha = 0.2f)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF047857), modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Applied",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color(0xFF047857),
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                } else {
                    Button(
                        onClick = onApplyClick,
                        colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                    ) {
                        Text("Apply", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }
        }
    }
}
