
from django.test import TestCase
from .models import Task


class TaskModelTest(TestCase):

    def test_create_task(self):
        task = Task.objects.create(
            title="Python o'rganish",
            priority="high"
        )

        self.assertEqual(task.title, "Python o'rganish")
        self.assertFalse(task.is_completed)
