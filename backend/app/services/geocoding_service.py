# app/services/geocoding_service.py
import requests


class GeocodingService:
    @staticmethod
    def reverse_geocode(lat: float, lon: float) -> str:
        """تبدیل مختصات به آدرس با استفاده از Nominatim"""
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        response = requests.get(url, headers={'User-Agent': 'YourAppName'})
        if response.status_code == 200:
            data = response.json()
            return data.get('display_name', '')
        return ""
