from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.http import response
from django.http.response import HttpResponse, JsonResponse
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken, GameSerializer
from .models import Game
from django.views.decorators.csrf import csrf_exempt
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
import json


# Auth stuff
@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Will manually define views (vs. using DRF) b/c we only need the CR from CRUD. I manually implemented JWT token validation, but probably should use DRF to handle it automatically.


def get_games(request, user_id):
    if not _validate_request(request):
        return JsonResponse({'error': 'Could not get games.'})

    games_queryset = Game.objects.filter(user_id=user_id)
    games_dict = {'games': []}
    for game in games_queryset:
        game_serializer = GameSerializer(game)
        games_dict['games'].append(game_serializer.data)
    return JsonResponse(games_dict)


@csrf_exempt
def create_game(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Must be a POST method.'})
    if _validate_request(request):
        game_obj = json.loads(request.body)
        game_obj['user'] = User.objects.get(id=game_obj['user'])
        # print(game_obj)
        new_game = Game.objects.create(**game_obj)
        new_game_serializer = GameSerializer(new_game)
        return JsonResponse(new_game_serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse({'error': 'Could not create game.'})


def _validate_request(request):
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'][4:]
        data = {'token': token}
        try:
            valid_data = VerifyJSONWebTokenSerializer().validate(data)
            if 'user' in valid_data:
                return True
        except:
            pass
    return False
