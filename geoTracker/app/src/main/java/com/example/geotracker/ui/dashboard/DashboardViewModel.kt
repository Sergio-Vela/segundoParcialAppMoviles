package com.example.geotracker.ui.dashboard

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.local.TokenStorage
import com.example.geotracker.data.repository.LocationRepository
import com.example.geotracker.model.response.LocationResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DashboardState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val locations: List<LocationResponse> = emptyList()
)

class DashboardViewModel(context: Context) : ViewModel() {
    private val repository = LocationRepository(context)

    private val _state = MutableStateFlow(DashboardState())
    val state: StateFlow<DashboardState> = _state

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
}
