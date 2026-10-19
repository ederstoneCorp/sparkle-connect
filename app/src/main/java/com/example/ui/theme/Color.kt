package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Sparkle Connect Brand Colors
val SparklePurple = Color(0xFF6C3BFF)
val SparkleOrange = Color(0xFFFF6B35)
val SparklePink = Color(0xFFF43F8C)
val SparkleBlue = Color(0xFF2878FF)
val SparkleMint = Color(0xFF28D7A0)
val SparkleYellow = Color(0xFFFFD447)

// Neutral Light
val SparkleLightBackground = Color(0xFFF7F7FC)
val SparkleCardBackground = Color(0xFFFFFFFF)
val SparklePrimaryText = Color(0xFF19172B)
val SparkleSecondaryText = Color(0xFF77758A)
val SparkleBorder = Color(0xFFE9E7F2)

// Neutral Dark
val SparkleDarkBackground = Color(0xFF11101B)
val SparkleDarkSurface = Color(0xFF1C1A2A)
val SparkleDarkText = Color(0xFFF7F5FF)
val SparkleDarkSecondaryText = Color(0xFFA5A3B8)
val SparkleDarkBorder = Color(0xFF2E2B44)

// Signature Gradients
val SparklePrimaryGradient = Brush.horizontalGradient(
    colors = listOf(SparklePurple, SparklePink)
)
val SparkleSecondaryGradient = Brush.horizontalGradient(
    colors = listOf(SparkleBlue, SparkleMint)
)
val SparkleAccentGradient = Brush.linearGradient(
    colors = listOf(SparkleOrange, SparkleYellow)
)
