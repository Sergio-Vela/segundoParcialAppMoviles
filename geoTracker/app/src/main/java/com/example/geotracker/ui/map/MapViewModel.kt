package com.example.geotracker.ui.map

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.repository.LocationRepository
import com.example.geotracker.model.response.LocationResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class MapState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val locations: List<LocationResponse> = emptyList(),
    val selectedLocation: LocationResponse? = null,
    val showDialog: Boolean = false
)

class MapViewModel(context: Context) : ViewModel() {
    private val repository = LocationRepository(context)

    private val _state = MutableStateFlow(MapState())
    val state: StateFlow<MapState> = _state

    fun loadLocations() {
        if (_state.value.isLoading) return
        _state.value = _state.value.copy(isLoading = true, errorMessage = null)
        viewModelScope.launch {
            val result = repository.getLocations()
            result.onSuccess { list ->
                _state.value = _state.value.copy(
                    isLoading = false,
                    locations = list,
                    errorMessage = null
                )
            }.onFailure { error ->
                _state.value = _state.value.copy(
                    isLoading = false,
                    errorMessage = error.message,
                    locations = emptyList()
                )
            }
        }
    }

    fun selectLocation(location: LocationResponse) {
        _state.value = _state.value.copy(
            selectedLocation = location,
            showDialog = true
        )
    }

    fun dismissDialog() {
        _state.value = _state.value.copy(
            selectedLocation = null,
            showDialog = false
        )
    }
}
