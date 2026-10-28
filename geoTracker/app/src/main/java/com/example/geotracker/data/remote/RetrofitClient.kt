package com.example.geotracker.data.remote

import android.content.Context
import com.example.geotracker.data.local.TokenStorage
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    private const val BASE_URL = "https://vela.aplicacionesweb2026.com/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private var httpClient: OkHttpClient? = null
    private var retrofit: Retrofit? = null

    fun getApiService(context: Context): ApiService {
        if (retrofit == null) {
            httpClient = OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .addInterceptor(AuthInterceptor { TokenStorage.getToken(context) })
                .build()

            retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(httpClient!!)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofit!!.create(ApiService::class.java)
    }

    fun resetClient() {
        httpClient = null
        retrofit = null
    }
}