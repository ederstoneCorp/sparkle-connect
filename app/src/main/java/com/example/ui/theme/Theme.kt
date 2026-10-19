package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SparklePurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF2E1B6B),
    onPrimaryContainer = Color(0xFFE2D9FF),
    secondary = SparklePink,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF5A1231),
    onSecondaryContainer = Color(0xFFFFD9E4),
    tertiary = SparkleMint,
    onTertiary = Color(0xFF003825),
    background = SparkleDarkBackground,
    onBackground = SparkleDarkText,
    surface = SparkleDarkSurface,
    onSurface = SparkleDarkText,
    surfaceVariant = SparkleDarkSurface2,
    onSurfaceVariant = SparkleDarkSecondaryText,
    outline = SparkleDarkBorder,
    error = Color(0xFFFF5252),
    onError = Color.White,
)

private val LightColorScheme = lightColorScheme(
    primary = SparklePurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEDE7FF),
    onPrimaryContainer = Color(0xFF2A009C),
    secondary = SparklePink,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFEBF2),
    onSecondaryContainer = Color(0xFF6B0033),
    tertiary = SparkleBlue,
    onTertiary = Color.White,
    background = SparkleLightBackground,
    onBackground = SparklePrimaryText,
    surface = SparkleCardBackground,
    onSurface = SparklePrimaryText,
    surfaceVariant = Color(0xFFF0EFF8),
    onSurfaceVariant = SparkleSecondaryText,
    outline = SparkleBorder,
    error = Color(0xFFDC2626),
    onError = Color.White,
)

// Composition local for in-app dark mode toggle
val LocalSparkleIsDark = compositionLocalOf { false }

@Composable
fun SparkleConnectTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    CompositionLocalProvider(LocalSparkleIsDark provides darkTheme) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography,
            content = content,
        )
    }
}
