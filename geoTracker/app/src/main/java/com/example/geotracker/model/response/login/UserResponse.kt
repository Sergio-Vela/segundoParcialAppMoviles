package com.example.geotracker.model.response.login

data class UserResponse(
    val id: Int,
    val nombre: String,
    val apellido: String,
    val usuario: String
)