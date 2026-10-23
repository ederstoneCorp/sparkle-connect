package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SparklePurpleLight,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF3B1569),
    onPrimaryContainer = Color.White,
    secondary = SparkleMaroonLight,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF500724),
    onSecondaryContainer = Color.White,
    tertiary = SparkleBlueLight,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFF1E3A8A),
    onTertiaryContainer = Color.White,
    background = SparkleDarkBackground,
    onBackground = SparkleDarkText,
    surface = SparkleDarkSurface,
    onSurface = SparkleDarkText,
    surfaceVariant = SparkleDarkSurface2,
    onSurfaceVariant = SparkleDarkSecondaryText,
    outline = SparkleDarkBorder,
    error = Color(0xFFEF4444),
    onError = Color.White,
)

private val LightColorScheme = lightColorScheme(
    primary = SparklePurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFF3E8FF),
    onPrimaryContainer = SparklePurpleDark,
    secondary = SparkleMaroon,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFE4E6),
    onSecondaryContainer = SparkleMaroonDark,
    tertiary = SparkleBlue,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFDBEAFE),
    onTertiaryContainer = SparkleBlueDark,
    background = SparkleLightBackground,
    onBackground = SparklePrimaryText,
    surface = SparkleCardBackground,
    onSurface = SparklePrimaryText,
    surfaceVariant = Color(0xFFF8FAFC),
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
