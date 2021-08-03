from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Game(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='games')
    won = models.BooleanField(default=False)
    user_throw = models.CharField(max_length=8, null=True)
    computer_throw = models.CharField(max_length=8, null=True)

    def __str__(self) -> str:
        return f"Won?: {self.won}"