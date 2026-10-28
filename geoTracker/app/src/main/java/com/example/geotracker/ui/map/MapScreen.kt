package com.example.geotracker.ui.map

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberMarkerState

@Composable
fun MapScreen(
    modifier: Modifier = Modifier,
    align: Modifier.Companion.(Alignment) -> Modifier
) {
    val context = LocalContext.current
    val viewModel: MapViewModel = viewModel(
        factory = object : androidx.lifecycle.ViewModelProvider.Factory {
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return MapViewModel(context) as T
            }
        }
    )

    val state by viewModel.state.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadLocations()
    }

    val cameraPositionState = rememberCameraPositionState()

    // Center camera when locations load
    LaunchedEffect(state.locations) {
        if (state.locations.isNotEmpty()) {
            val first = state.locations.first()
            val target = LatLng(first.latitud, first.longitud)
            cameraPositionState.position = CameraPosition.fromLatLngZoom(
                target,
                12f
            )
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        if (state.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
        }

        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            onMapLoaded = {}
        ) {
            state.locations.forEach { location ->
                val markerState = rememberMarkerState(position = LatLng(location.latitud, location.longitud))
                Marker(
                    state = markerState,
                    title = location.nombre,
                    snippet = location.descripcion,
                    onClick = { marker ->
                        viewModel.selectLocation(location)
                        true // Consume click, don't show InfoWindow
                    }
                )
            }
        }
    }

    if (state.showDialog && state.selectedLocation != null) {
        val selected = state.selectedLocation!!
        AlertDialog(
            onDismissRequest = { viewModel.dismissDialog() },
            title = { Text(selected.nombre) },
            text = {
                Text(
                    "Descripción: ${selected.descripcion}\n\nLatitud: ${selected.latitud}\nLongitud: ${selected.longitud}"
                )
            },
            confirmButton = {
                Button(onClick = { viewModel.dismissDialog() }) {
                    Text("Cerrar")
                }
            }
        )
    }

    if (state.errorMessage != null) {
        Text(
            text = state.errorMessage!!,
            modifier = Modifier.align(Alignment.Center),
            color = androidx.compose.ui.graphics.Color.Red
        )
    }

    if (!state.isLoading && state.locations.isEmpty() && state.errorMessage == null) {
        Text(
            text = "No hay ubicaciones registradas",
            modifier = Modifier.align(Alignment.Center)
        )
    }
}
