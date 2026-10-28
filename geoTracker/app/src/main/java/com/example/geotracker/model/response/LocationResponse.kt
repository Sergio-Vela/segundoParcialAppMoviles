package com.example.geotracker.model.response

data class LocationResponse(
    val id: Int,
    val userId: Int,
    val nombre: String,
    val descripcion: String,
    val latitud: Double,
    val longitud: Double,
    val createdAt: String,
    val updatedAt: String
)