from django.urls import include, path


urlpatterns = [
    path("gateway/", include("authentication.urls")),
]
