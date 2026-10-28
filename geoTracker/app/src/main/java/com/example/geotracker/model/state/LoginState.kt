package com.example.geotracker.model.state

data class LoginState(
    val id: Int = 0,
    val user: String = "",
    val password: String = "",
    val nombre: String = "",
    val apellido: String = "",
    val token: String = "",
    val message: String = "",
    val loginExito: Boolean = false
)
