from django.contrib import admin
from .models import Project, Chapter, Comment

# Register your models here.
admin.site.register(Project)
admin.site.register(Chapter)
admin.site.register(Comment)
