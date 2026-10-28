package com.example.geotracker.data.local

import android.content.Context
import android.content.SharedPreferences

object TokenStorage {
    private const val PREF_NAME = "geo_tracker_prefs"
    private const val KEY_TOKEN = "auth_token"
    private const val KEY_USER = "auth_user"

    fun init(context: Context) {
        // Lazy initialization handled via getPrefs
    }

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun saveToken(context: Context, token: String) {
        getPrefs(context).edit().putString(KEY_TOKEN, token).apply()
    }

    fun getToken(context: Context): String? {
        return getPrefs(context).getString(KEY_TOKEN, null)
    }

    fun clearToken(context: Context) {
        getPrefs(context).edit().remove(KEY_TOKEN).apply()
    }

    fun saveUser(context: Context, userId: Int, nombre: String, apellido: String, usuario: String) {
        getPrefs(context).edit()
            .putInt("user_id", userId)
            .putString("user_nombre", nombre)
            .putString("user_apellido", apellido)
            .putString("user_usuario", usuario)
            .apply()
    }

    fun getUserId(context: Context): Int = getPrefs(context).getInt("user_id", 0)
    fun getUserName(context: Context): String? = getPrefs(context).getString("user_nombre", null)
    fun getUserLastName(context: Context): String? = getPrefs(context).getString("user_apellido", null)
    fun getUserUsername(context: Context): String? = getPrefs(context).getString("user_usuario", null)
}
