package com.example.ui.screens

import androidx.compose.foundation.background
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
import com.example.data.model.Community
import com.example.ui.theme.*

@Composable
fun CommunitiesScreen(
    communities: List<Community>,
    onToggleJoin: (String) -> Unit,
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
                colors = CardDefaults.cardColors(containerColor = SparkleBlue),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Campus Communities & Guilds 🤝",
                        style = MaterialTheme.typography.titleMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Join faculty clubs, coding guilds, debate societies, and cross-campus innovators across Kenya.",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = Color.White.copy(alpha = 0.9f),
                            lineHeight = 18.sp
                        )
                    )
                }
            }
        }

        if (isLoading) {
            items(4) {
                com.example.ui.components.CommunityShimmerItem()
            }
        } else {
            items(communities, key = { it.id }) { community ->
                CommunityCard(
                    community = community,
                    onToggleJoin = { onToggleJoin(community.id) }
                )
            }
        }
    }
}

@Composable
fun CommunityCard(
    community: Community,
    onToggleJoin: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("community_card_${community.id}")
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SparklePrimaryGradient),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Groups,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(26.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = community.name,
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${community.universityAffiliation} • ${community.membersCount} members",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 12.sp
                        )
                    )
                }

                // Join/Leave Button
                if (community.isJoined) {
                    OutlinedButton(
                        onClick = onToggleJoin,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.testTag("leave_community_${community.id}")
                    ) {
                        Text("Joined ✓", color = SparkleMint, fontWeight = FontWeight.Bold)
                    }
                } else {
                    Button(
                        onClick = onToggleJoin,
                        colors = ButtonDefaults.buttonColors(containerColor = SparklePurple),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.testTag("join_community_${community.id}")
                    ) {
                        Text("Join", fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = community.description,
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 20.sp
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Tag Pills
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                community.tags.forEach { tag ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = SparklePurple.copy(alpha = 0.08f)
                    ) {
                        Text(
                            text = "#$tag",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = SparklePurple,
                                fontWeight = FontWeight.SemiBold
                            ),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Led by ${community.leaderName}",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 11.sp
                )
            )
        }
    }
}
