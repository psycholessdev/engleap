'use client'
import axios from 'axios'

declare global {
  interface Window {
    __API_URL__?: string
  }
}

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.__API_URL__) {
      return window.__API_URL__
    }
    // fallback for dev
    return `http://${window.location.hostname}:3001/api`
  }

  // fallback for non-browser execution
  return `http://localhost:3001/api`
}

export const API_URL = getApiUrl()

export const $axios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
  withCredentials: true,
})
