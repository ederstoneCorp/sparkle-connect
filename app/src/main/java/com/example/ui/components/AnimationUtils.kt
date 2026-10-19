package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha

/**
 * Composable that wraps content with a standardized Sparkle Connect entrance animation.
 * - Fades in from transparent
 * - Slides up from 20dp below
 *
 * Usage: wrap any screen-level composable with SparkleEntrance { ... }
 */
@Composable
fun SparkleEntrance(
    modifier: Modifier = Modifier,
    delayMs: Int = 0,
    content: @Composable () -> Unit,
) {
    var visible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        if (delayMs > 0) kotlinx.coroutines.delay(delayMs.toLong())
        visible = true
    }

    AnimatedVisibility(
        visible = visible,
        modifier = modifier,
        enter = fadeIn(
            animationSpec = tween(durationMillis = 350, delayMillis = delayMs, easing = FastOutSlowInEasing)
        ) + slideInVertically(
            initialOffsetY = { it / 6 },
            animationSpec = tween(durationMillis = 400, delayMillis = delayMs, easing = FastOutSlowInEasing)
        ),
    ) {
        content()
    }
}

/**
 * Staggered entrance for list items. Pass index (0-based) for delay multiplier.
 */
@Composable
fun StaggeredEntrance(
    index: Int,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    SparkleEntrance(
        modifier = modifier,
        delayMs = index * 60,
        content = content,
    )
}
