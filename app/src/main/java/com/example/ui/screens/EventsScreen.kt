package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CampusEvent
import com.example.ui.theme.*

@Composable
fun EventsScreen(
    events: List<CampusEvent>,
    onToggleRegistration: (String) -> Unit,
    isLoading: Boolean = false,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 14.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Banner
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SparkleMint),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Campus Events & Summits 🎪",
                        style = MaterialTheme.typography.titleMedium.copy(
                            color = Color(0xFF003825),
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Hackathons, career expos, workshops, and student festivals happening across Kenya.",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = Color(0xFF004D34),
                            lineHeight = 18.sp
                        )
                    )
                }
            }
        }

        if (isLoading) {
            items(3) {
                com.example.ui.components.GigShimmerItem()
            }
        } else {
            items(events, key = { it.id }) { event ->
                EventCard(
                    event = event,
                    onToggleRegistration = { onToggleRegistration(event.id) }
                )
            }
        }
    }
}

@Composable
fun EventCard(
    event: CampusEvent,
    onToggleRegistration: () -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = when (event.coverGradientIndex) {
        0 -> SparklePrimaryGradient
        1 -> SparkleSecondaryGradient
        else -> SparkleAccentGradient
    }

    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("event_card_${event.id}")
    ) {
        Column {
            // Visual Banner Header
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
                    .background(gradient)
                    .padding(14.dp)
            ) {
                Column(modifier = Modifier.align(Alignment.BottomStart)) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color.Black.copy(alpha = 0.35f)
                    ) {
                        Text(
                            text = event.category,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            ),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = event.title,
                        style = MaterialTheme.typography.titleMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Column(modifier = Modifier.padding(16.dp)) {
                // Date, Time, Venue info
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CalendarToday,
                        contentDescription = null,
                        tint = SparklePurple,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${event.dateString} • ${event.timeString}",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (event.isOnline) Icons.Default.Videocam else Icons.Default.Place,
                        contentDescription = null,
                        tint = SparklePink,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${event.venue} (${event.university})",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = event.description,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 20.sp
                    )
                )

                Spacer(modifier = Modifier.height(14.dp))
                Divider(color = SparkleBorder.copy(alpha = 0.5f), thickness = 0.8.dp)
                Spacer(modifier = Modifier.height(10.dp))

                // Footer: Attendee count & RSVP button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.People,
                            contentDescription = null,
                            tint = SparklePurple,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${event.attendeeCount} students attending",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }

                    if (event.isRegistered) {
                        OutlinedButton(
                            onClick = onToggleRegistration,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.testTag("rsvp_cancel_${event.id}")
                        ) {
                            Text("RSVP Confirmed ✓", color = SparkleMint, fontWeight = FontWeight.Bold)
                        }
                    } else {
                        Button(
                            onClick = onToggleRegistration,
                            colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.testTag("rsvp_register_${event.id}")
                        ) {
                            Text("Register RSVP", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
