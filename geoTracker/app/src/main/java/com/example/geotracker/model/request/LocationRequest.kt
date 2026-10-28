package com.example.geotracker.model.request

import android.location.Location

data class LocationRequest(
    val nombre: String,
    val descripcion: String,
    val latitud: Double,
    val longitud: Double
) {
    companion object {
        fun fromLocation(location: Location, nombre: String, descripcion: String): LocationRequest {
            return LocationRequest(
                nombre = nombre,
                descripcion = descripcion,
                latitud = location.latitude,
                longitud = location.longitude
            )
        }
    }
}
