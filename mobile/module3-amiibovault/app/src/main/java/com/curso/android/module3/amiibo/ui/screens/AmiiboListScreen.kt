package com.curso.android.module3.amiibo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.ui.graphics.vector.ImageVector
import coil3.compose.AsyncImage
import com.curso.android.module3.amiibo.R
import com.curso.android.module3.amiibo.data.local.entity.AmiiboEntity
import com.curso.android.module3.amiibo.domain.error.ErrorType
import com.curso.android.module3.amiibo.ui.viewmodel.AmiiboUiState
import com.curso.android.module3.amiibo.ui.viewmodel.AmiiboViewModel
import org.koin.androidx.compose.koinViewModel

/**
 * ============================================================================
 * AMIIBO LIST SCREEN - Pantalla Principal (Jetpack Compose)
 * ============================================================================
 *
 * Esta pantalla muestra la colección de Amiibos en un grid de 2 columnas.
 * Implementa el patrón de UI reactiva con:
 * - StateFlow para el estado
 * - when exhaustivo para manejar todos los estados
 * - Coil para carga asíncrona de imágenes
 *
 * ESTRUCTURA DE LA UI:
 * --------------------
 *
 *   ┌─────────────────────────────────────────┐
 *   │           TOP APP BAR                   │
 *   │  [Amiibo Vault]              [Refresh]  │
 *   ├─────────────────────────────────────────┤
 *   │                                         │
 *   │   ┌─────────┐    ┌─────────┐           │
 *   │   │  IMG    │    │  IMG    │           │
 *   │   │         │    │         │           │
 *   │   │  Name   │    │  Name   │           │
 *   │   │  Series │    │  Series │           │
 *   │   └─────────┘    └─────────┘           │
 *   │                                         │
 *   │   ┌─────────┐    ┌─────────┐           │
 *   │   │  IMG    │    │  IMG    │           │
 *   │   │  ...    │    │  ...    │           │
 *   │                                         │
 *   └─────────────────────────────────────────┘
 *
 * ============================================================================
 */

/**
 * Pantalla principal que muestra la lista de Amiibos.
 *
 * @OptIn(ExperimentalMaterial3Api::class):
 * - TopAppBar es experimental en Material3
 * - Requerido por las especificaciones del proyecto
 *
 * @param viewModel ViewModel inyectado por Koin
 *   - koinViewModel() busca el ViewModel en el contenedor de Koin
 *   - Equivalente a by viewModel() pero para Compose
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AmiiboListScreen(
    onAmiiboClick: (String) -> Unit = {},
    viewModel: AmiiboViewModel = koinViewModel()
) {
    /**
     * collectAsStateWithLifecycle():
     * - Convierte StateFlow a State de Compose
     * - Respeta el lifecycle (pausa colección cuando la UI no es visible)
     * - Más eficiente que collectAsState() normal
     *
     * 'by' es delegación de propiedades:
     * - uiState se comporta como AmiiboUiState directamente
     * - Sin 'by' sería: uiState.value para acceder
     */
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            /**
             * TopAppBar de Material 3.
             *
             * Componentes:
             * - title: Título de la app
             * - actions: Botones de acción (refresh)
             * - colors: Esquema de colores personalizado
             */
            TopAppBar(
                title = {
                    Text(
                        text = stringResource(R.string.app_name),
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                actions = {
                    // Botón de refresh
                    IconButton(onClick = { viewModel.refreshAmiibos() }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = stringResource(R.string.retry)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        /**
         * =====================================================================
         * MANEJO DE ESTADOS CON WHEN EXHAUSTIVO
         * =====================================================================
         *
         * when sobre sealed interface garantiza que manejemos TODOS los casos.
         * Si agregas un nuevo estado al sealed interface, el compilador
         * te obligará a manejarlo aquí.
         *
         * Esto elimina errores comunes como:
         * - Olvidar manejar el estado de error
         * - Estados inconsistentes (loading + error al mismo tiempo)
         */
        when (val state = uiState) {
            // Estado de carga inicial
            is AmiiboUiState.Loading -> {
                LoadingContent(
                    modifier = Modifier.padding(paddingValues)
                )
            }

            // Estado de éxito con datos
            is AmiiboUiState.Success -> {
                Column(modifier = Modifier.padding(paddingValues)) {
                    // Indicador de refresh en la parte superior
                    if (state.isRefreshing) {
                        LinearProgressIndicator(
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    // Grid de Amiibos
                    AmiiboGrid(
                        amiibos = state.amiibos,
                        onAmiiboClick = onAmiiboClick,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }

            /**
             * Estado de error con tipo específico.
             *
             * CONCEPTO: Errores Tipados en UI
             * -------------------------------
             * El estado de error ahora incluye:
             * - errorType: Para mostrar iconos apropiados
             * - isRetryable: Para decidir si mostrar botón de reintentar
             *
             * Esto mejora la UX porque:
             * - El usuario ve un icono que representa el problema
             * - Solo ve "Reintentar" cuando tiene sentido
             */
            is AmiiboUiState.Error -> {
                if (state.cachedAmiibos.isNotEmpty()) {
                    // Hay datos en cache: mostrar datos + mensaje de error
                    Column(modifier = Modifier.padding(paddingValues)) {
                        ErrorBanner(
                            message = state.message,
                            errorType = state.errorType,
                            isRetryable = state.isRetryable,
                            onRetry = { viewModel.refreshAmiibos() }
                        )
                        AmiiboGrid(
                            amiibos = state.cachedAmiibos,
                            onAmiiboClick = onAmiiboClick,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                } else {
                    // Sin cache: pantalla de error completa
                    ErrorContent(
                        message = state.message,
                        errorType = state.errorType,
                        isRetryable = state.isRetryable,
                        onRetry = { viewModel.refreshAmiibos() },
                        modifier = Modifier.padding(paddingValues)
                    )
                }
            }
        }
    }
}

/**
 * ============================================================================
 * COMPONENTES DE UI REUTILIZABLES
 * ============================================================================
 */

/**
 * Contenido mostrado durante la carga inicial.
 *
 * CircularProgressIndicator:
 * - Indicador de progreso indeterminado
 * - Material 3 style
 */
@Composable
private fun LoadingContent(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(48.dp)
            )
            Text(
                text = stringResource(R.string.loading_amiibos),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

/**
 * Contenido mostrado cuando hay error y no hay cache.
 *
 * CONCEPTO: Iconos por Tipo de Error
 * ----------------------------------
 * Cada tipo de error muestra un icono diferente para comunicar
 * visualmente la naturaleza del problema al usuario.
 *
 * @param message Mensaje de error
 * @param errorType Tipo de error para mostrar icono apropiado
 * @param isRetryable Si true, muestra botón de reintentar
 * @param onRetry Callback para reintentar
 */
@Composable
private fun ErrorContent(
    message: String,
    errorType: ErrorType,
    isRetryable: Boolean,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(32.dp)
        ) {
            // Icono según el tipo de error
            Icon(
                imageVector = errorType.toIcon(),
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.error
            )

            Text(
                text = stringResource(R.string.error_loading),
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.error
            )
            Text(
                text = message,
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Solo mostrar botón si el error es recuperable
            if (isRetryable) {
                Button(onClick = onRetry) {
                    Text(text = stringResource(R.string.retry))
                }
            }
        }
    }
}

/**
 * Función de extensión para obtener el icono según el tipo de error.
 *
 * CONCEPTO: Extension Functions
 * ----------------------------
 * Las funciones de extensión permiten agregar métodos a clases
 * existentes sin modificarlas. Aquí agregamos toIcon() a ErrorType.
 */
private fun ErrorType.toIcon(): ImageVector = when (this) {
    ErrorType.NETWORK -> Icons.Default.CloudOff   // Sin conexión
    ErrorType.PARSE -> Icons.Default.Warning      // Error de datos
    ErrorType.DATABASE -> Icons.Default.Storage   // Error de BD
    ErrorType.UNKNOWN -> Icons.Default.Error      // Error genérico
}

/**
 * Banner de error mostrado sobre contenido existente.
 *
 * Útil cuando hay error pero tenemos datos en cache.
 * Muestra un icono pequeño según el tipo de error.
 *
 * @param errorType Tipo de error para mostrar icono apropiado
 * @param isRetryable Si true, muestra botón de reintentar
 */
@Composable
private fun ErrorBanner(
    message: String,
    errorType: ErrorType,
    isRetryable: Boolean,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.errorContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Icono pequeño según el tipo de error
            Icon(
                imageVector = errorType.toIcon(),
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.onErrorContainer
            )

            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onErrorContainer,
                modifier = Modifier.padding(top = 4.dp)
            )

            // Solo mostrar botón si el error es recuperable
            if (isRetryable) {
                Button(
                    onClick = onRetry,
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    Text(text = stringResource(R.string.retry))
                }
            }
        }
    }
}

/**
 * Grid de Amiibos usando LazyVerticalGrid.
 *
 * LazyVerticalGrid:
 * - Renderiza solo los items visibles (eficiente)
 * - GridCells.Fixed(2): 2 columnas fijas
 * - items(): Itera sobre la lista de Amiibos
 *
 * @param amiibos Lista de Amiibos a mostrar
 */
@Composable
private fun AmiiboGrid(
    amiibos: List<AmiiboEntity>,
    onAmiiboClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    /**
     * LazyVerticalGrid es el equivalente de RecyclerView con GridLayoutManager.
     *
     * Características:
     * - Lazy: Solo renderiza items visibles en pantalla
     * - Recicla celdas al hacer scroll (eficiente en memoria)
     * - Soporta headers, footers, spans personalizados
     *
     * GridCells.Fixed(2): Exactamente 2 columnas
     * GridCells.Adaptive(minSize = 150.dp): Tantas columnas como quepan
     */
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        modifier = modifier,
        contentPadding = PaddingValues(12.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        /**
         * items(amiibos, key = { it.id }):
         * - Itera sobre cada Amiibo
         * - key: Identificador único para optimizar recomposición
         *   Cuando la lista cambia, Compose usa el key para:
         *   - Reusar componentes existentes
         *   - Animar cambios correctamente
         *   - Preservar estado interno de cada item
         */
        items(
            items = amiibos,
            key = { it.id }  // Importante para optimización
        ) { amiibo ->
            AmiiboCard(
                amiibo = amiibo,
                onClick = { onAmiiboClick(amiibo.name) }
            )
        }
    }
}

/**
 * Card individual para mostrar un Amiibo.
 *
 * Usa AsyncImage de Coil para cargar imágenes de forma asíncrona.
 *
 * @param amiibo Datos del Amiibo a mostrar
 */
@Composable
private fun AmiiboCard(
    amiibo: AmiiboEntity,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Box {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Imagen con fondo degradado
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                                    MaterialTheme.colorScheme.surface
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    AsyncImage(
                        model = amiibo.imageUrl,
                        contentDescription = stringResource(
                            R.string.amiibo_image_description,
                            amiibo.name
                        ),
                        contentScale = ContentScale.Fit,
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                    )
                }

                // Información del Amiibo
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Nombre del Amiibo
                        Text(
                            text = amiibo.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            color = MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Chip con la serie del juego
                        Surface(
                            modifier = Modifier.padding(top = 6.dp),
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.primaryContainer
                        ) {
                            Text(
                                text = amiibo.gameSeries,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                textAlign = TextAlign.Center,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * ============================================================================
 * NOTAS ADICIONALES SOBRE COMPOSE
 * ============================================================================
 *
 * 1. RECOMPOSICIÓN:
 *    - Compose solo recompone lo que cambia
 *    - Usar 'key' en listas para optimizar
 *    - remember {} para cachear valores entre recomposiciones
 *
 * 2. PREVIEWS:
 *    ```kotlin
 *    @Preview(showBackground = true)
 *    @Composable
 *    fun AmiiboCardPreview() {
 *        AmiiboVaultTheme {
 *            AmiiboCard(
 *                amiibo = AmiiboEntity(
 *                    id = "1",
 *                    name = "Mario",
 *                    gameSeries = "Super Mario",
 *                    imageUrl = "https://example.com/mario.png"
 *                )
 *            )
 *        }
 *    }
 *    ```
 *
 * 3. PULL TO REFRESH (requiere material3 + material):
 *    ```kotlin
 *    PullToRefreshBox(
 *        isRefreshing = state.isRefreshing,
 *        onRefresh = { viewModel.refreshAmiibos() }
 *    ) {
 *        AmiiboGrid(...)
 *    }
 *    ```
 *
 * ============================================================================
 */
