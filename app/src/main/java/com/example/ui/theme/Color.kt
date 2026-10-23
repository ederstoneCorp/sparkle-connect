package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Core Revamped Brand Colors: Purple, Maroon, and Blue
val SparklePurple = Color(0xFF6B21A8)       // Deep Royal Purple
val SparklePurpleDark = Color(0xFF4C1D95)   // Midnight Purple
val SparklePurpleLight = Color(0xFF9333EA)  // Vibrant Amethyst
val SparklePurpleVibrant = Color(0xFF7C3AED)

val SparkleMaroon = Color(0xFF831843)       // Rich Campus Maroon / Burgundy
val SparkleMaroonDark = Color(0xFF500724)   // Deep Wine Maroon
val SparkleMaroonLight = Color(0xFF9F1239)  // Crimson Maroon
val SparkleMaroonVibrant = Color(0xFFBE123C)

val SparkleBlue = Color(0xFF1D4ED8)         // Facebook / Campus Royal Blue
val SparkleBlueDark = Color(0xFF1E3A8A)     // Navy Blue
val SparkleBlueLight = Color(0xFF2563EB)    // Electric Blue
val SparkleBlueSky = Color(0xFF38BDF8)

// Accent Status colors
val SparkleGreen = Color(0xFF059669)
val SparkleMint = Color(0xFF10B981)
val SparkleOrange = Color(0xFFEA580C)
val SparkleYellow = Color(0xFFF59E0B)

// Instagram & Facebook Style Light Theme Surfaces
val SparkleLightBackground = Color(0xFFF0F2F5) // Clean Facebook/Instagram feed background
val SparkleCardBackground = Color(0xFFFFFFFF)  // Pure white card
val SparklePrimaryText = Color(0xFF050505)     // Sharp deep contrast text
val SparkleSecondaryText = Color(0xFF65676B)   // Neutral meta text
val SparkleBorder = Color(0xFFE4E6EB)          // Subtle card divider border

// Clean Dark Theme Surfaces
val SparkleDarkBackground = Color(0xFF0E0B16)  // Deep midnight purple-black
val SparkleDarkSurface = Color(0xFF181324)     // Rich dark container
val SparkleDarkSurface2 = Color(0xFF231B33)    // Elevated surface
val SparkleDarkText = Color(0xFFFFFFFF)        // Crisp white text
val SparkleDarkSecondaryText = Color(0xFFA59EB3)
val SparkleDarkBorder = Color(0xFF2F2544)

// Signature Purple-Maroon-Blue Gradients
val SparkleBrandGradient = Brush.linearGradient(
    colors = listOf(SparklePurple, SparkleMaroon, SparkleBlue)
)

val SparklePrimaryGradient = Brush.horizontalGradient(
    colors = listOf(SparklePurple, SparkleMaroon)
)

val SparkleSecondaryGradient = Brush.horizontalGradient(
    colors = listOf(SparkleMaroon, SparkleBlue)
)

val SparkleBluePurpleGradient = Brush.horizontalGradient(
    colors = listOf(SparkleBlue, SparklePurple)
)

val SparkleAccentGradient = Brush.horizontalGradient(
    colors = listOf(SparkleMaroon, SparkleBlue)
)

// Instagram-style Story Ring Gradient (Purple -> Maroon -> Blue)
val SparkleStoryRingGradient = Brush.sweepGradient(
    colors = listOf(
        SparklePurple,
        SparkleMaroon,
        SparkleBlue,
        SparkleMaroonLight,
        SparklePurple
    )
)

// Legacy alias compatibility so all existing imports continue seamlessly
val SparklePink = SparkleMaroon
