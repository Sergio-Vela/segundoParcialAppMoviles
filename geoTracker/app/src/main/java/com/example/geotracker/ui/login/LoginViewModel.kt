package com.example.geotracker.ui.login

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.repository.AuthRepository
import com.example.geotracker.model.state.LoginState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlin.onSuccess

class LoginViewModel(
    application: Application
) : AndroidViewModel(application) {
    private val repository = AuthRepository(getApplication())
    private val _state = MutableStateFlow(LoginState())
    val state: StateFlow<LoginState> = _state
    fun onUserChange(nuevoUsuario: String) {
        _state.value = _state.value.copy(
            user = nuevoUsuario
        )
    }
    fun onPasswordChange(nuevoPassword: String) {
        _state.value = _state.value.copy(
            password = nuevoPassword
        )
    }
    fun onLoginClic() {

        viewModelScope.launch {

            val resultado = repository.login(
                _state.value.user,
                _state.value.password
            )

            resultado.onSuccess { response ->

                _state.value = _state.value.copy(
                    id = response.body.user.id,
                    user = response.body.user.usuario,
                    loginExito = true,
                    token = response.body.token,
                    message = response.standardResponse.message,
                    nombre = response.body.user.nombre,
                    apellido = response.body.user.apellido
                )

            }.onFailure { error ->

                _state.value = _state.value.copy(
                    loginExito = false,
                    message = error.message.toString()
                )
            }
        }
    }
}