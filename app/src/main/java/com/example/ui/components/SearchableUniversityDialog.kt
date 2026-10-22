package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Language
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
import androidx.compose.ui.window.Dialog
import com.example.data.api.GeminiSearchService
import com.example.data.model.University
import com.example.ui.theme.*
import kotlinx.coroutines.launch

/**
 * Real Searchable Kenyan University Dialog with Live Filtering & Google Grounded Search.
 * Allows searching any Kenyan university, constituent college, or campus location.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchableUniversityDialog(
    universities: List<University>,
    selectedUniversity: University?,
    onSelectUniversity: (University) -> Unit,
    onDismiss: () -> Unit,
    allowAllCampuses: Boolean = false,
    onSelectAllCampuses: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var isGoogleSearching by remember { mutableStateOf(false) }
    var googleSearchResult by remember { mutableStateOf<String?>(null) }
    var googleSearchError by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    val filteredUniversities = remember(searchQuery, universities) {
        if (searchQuery.isBlank()) {
            universities
        } else {
            val q = searchQuery.trim().lowercase()
            universities.filter { uni ->
                uni.name.lowercase().contains(q) ||
                uni.shortName.lowercase().contains(q) ||
                uni.location.lowercase().contains(q)
            }
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f)
                .testTag("searchable_university_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(SparklePrimaryGradient),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.School,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Search Universities 🇰🇪",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Real Kenyan institutions & campuses",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 11.sp
                                )
                            )
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Search input
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search by name, acronym, or location...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null, tint = SparklePurple)
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = SparklePurple,
                        unfocusedBorderColor = SparkleBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("university_search_input")
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Google Search Grounding Trigger Button
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = SparklePurple.copy(alpha = 0.08f),
                    border = BorderStroke(1.dp, SparklePurple.copy(alpha = 0.25f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(enabled = !isGoogleSearching) {
                            val targetQuery = if (searchQuery.isNotBlank()) {
                                "Kenyan university campus info: $searchQuery"
                            } else {
                                "Kenyan university campus guide and accredited institutions"
                            }
                            isGoogleSearching = true
                            googleSearchResult = null
                            googleSearchError = null
                            coroutineScope.launch {
                                val res = GeminiSearchService.searchCampusGroundedInfo(targetQuery)
                                isGoogleSearching = false
                                if (res.isSuccess) {
                                    googleSearchResult = res.getOrNull()?.answer
                                } else {
                                    googleSearchError = res.exceptionOrNull()?.message ?: "Google search failed"
                                }
                            }
                        }
                        .testTag("university_google_search_button")
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Language,
                            contentDescription = "Google Search",
                            tint = SparklePurple,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (searchQuery.isNotBlank()) "Search Google for '$searchQuery' campus facts" else "Search Google for Kenyan Campus Guide",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = SparklePurple
                            ),
                            modifier = Modifier.weight(1f)
                        )
                        if (isGoogleSearching) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = SparklePurple
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Default.ArrowForward,
                                contentDescription = null,
                                tint = SparklePurple,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }

                // Google Grounded Result Preview (if user searched)
                AnimatedVisibility(visible = googleSearchResult != null || googleSearchError != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                        border = BorderStroke(1.dp, SparkleBorder),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Google Search Campus Intelligence",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SparklePurple,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                                IconButton(
                                    onClick = {
                                        googleSearchResult = null
                                        googleSearchError = null
                                    },
                                    modifier = Modifier.size(20.dp)
                                ) {
                                    Icon(Icons.Default.Close, contentDescription = "Dismiss", modifier = Modifier.size(14.dp))
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = googleSearchResult ?: googleSearchError ?: "",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontSize = 11.sp,
                                    lineHeight = 15.sp
                                ),
                                maxLines = 5
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // University list
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    if (allowAllCampuses && onSelectAllCampuses != null) {
                        item {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (selectedUniversity == null) SparklePurple.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface,
                                border = BorderStroke(1.dp, if (selectedUniversity == null) SparklePurple else SparkleBorder),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onSelectAllCampuses()
                                        onDismiss()
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(SparkleOrange.copy(alpha = 0.2f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(Icons.Default.Public, contentDescription = null, tint = SparkleOrange, modifier = Modifier.size(18.dp))
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "All Kenyan Universities (National Feed)",
                                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                                        )
                                        Text(
                                            text = "View content from across all 47 counties & campuses",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 11.sp
                                            )
                                        )
                                    }
                                    if (selectedUniversity == null) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(18.dp))
                                    }
                                }
                            }
                        }
                    }

                    items(filteredUniversities, key = { it.name }) { uni ->
                        val isSelected = selectedUniversity?.name == uni.name
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) SparklePurple.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface,
                            border = BorderStroke(1.dp, if (isSelected) SparklePurple else SparkleBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    onSelectUniversity(uni)
                                    onDismiss()
                                }
                                .testTag("university_item_${uni.shortName}")
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(if (isSelected) SparklePurple else SparkleBorder.copy(alpha = 0.4f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = uni.shortName.take(3),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else SparklePurple,
                                            fontSize = 10.sp
                                        )
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "${uni.shortName} - ${uni.name}",
                                        style = MaterialTheme.typography.titleSmall.copy(
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                                            color = if (isSelected) SparklePurple else MaterialTheme.colorScheme.onSurface
                                        )
                                    )
                                    Text(
                                        text = uni.location,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontSize = 11.sp
                                        )
                                    )
                                }

                                if (isSelected) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = "Selected",
                                        tint = SparklePurple,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }

                    if (filteredUniversities.isEmpty()) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 24.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Default.SearchOff, contentDescription = null, tint = SparklePurple, modifier = Modifier.size(36.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "No university matches '$searchQuery'",
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
                                )
                                Text(
                                    text = "Use the Google search button above to search campus records",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
