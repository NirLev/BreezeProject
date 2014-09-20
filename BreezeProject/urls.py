from django.conf.urls import patterns, include, url
# from django.contrib import admin

urlpatterns = [
    url(r'^$', 'BreezeAppCalc.views.home', name='home'),
    # url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]