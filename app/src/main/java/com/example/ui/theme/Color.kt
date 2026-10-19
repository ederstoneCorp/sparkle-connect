package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Brand colors
val SparklePurple = Color(0xFF6C3BFF)
val SparklePurpleDark = Color(0xFF5022D9)
val SparklePurpleLight = Color(0xFF9B6FFF)
val SparklePink = Color(0xFFF43F8C)
val SparkleOrange = Color(0xFFFF6B35)
val SparkleBlue = Color(0xFF2878FF)
val SparkleMint = Color(0xFF28D7A0)
val SparkleYellow = Color(0xFFFFD447)

// Light theme
val SparkleLightBackground = Color(0xFFF8F9FD)
val SparkleCardBackground = Color(0xFFFFFFFF)
val SparklePrimaryText = Color(0xFF0F172A)
val SparkleSecondaryText = Color(0xFF64748B)
val SparkleBorder = Color(0xFFE2E8F0)

// Dark theme
val SparkleDarkBackground = Color(0xFF11101B)
val SparkleDarkSurface = Color(0xFF1C1A2A)
val SparkleDarkSurface2 = Color(0xFF242236)
val SparkleDarkText = Color(0xFFE8E6F0)
val SparkleDarkSecondaryText = Color(0xFF9895B5)
val SparkleDarkBorder = Color(0xFF2E2B45)

// Avatar / initials gradient
val SparklePrimaryGradient = Brush.linearGradient(
    colors = listOf(SparklePurple, SparklePink)
)
val SparkleSecondaryGradient = Brush.horizontalGradient(
    colors = listOf(SparkleBlue, SparkleMint)
)
val SparkleAccentGradient = Brush.linearGradient(
    colors = listOf(SparkleOrange, SparkleYellow)
)
val SparkleGreenGradient = Brush.linearGradient(
    colors = listOf(Color(0xFF10B981), Color(0xFF28D7A0))
)

