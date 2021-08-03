from .views import current_user, UserList, get_games, create_game
from django.urls import path

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('users/<int:user_id>/games/', get_games),
    path('users/<int:user_id>/games/new/', create_game),
]
