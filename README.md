# school-tasks-tester

Репозиторий с заданиями наборов в школу программистов hh

## Использование автоматического тестирования

Зависимости: `node 12`, `yarn`

Перед тестированием нужно запустить `yarn configure` и указать год, 
а также путь запуска для разных языков программирования

Для запуска тестирования, нужно использовать
```shell
yarn test <TASK_NUMBER> <LANG> [<SUFFIX>] [--run][--big]
```
Параметры:
* `TASK_NUMBER` – номер задания, обычно 1 или 2
* `LANG` – язык программирования - js, py, java
* `SUFFIX` – суффикс названия задания, при передаче `my`, запустит тесты для файла `taskN/taskN_my.py`. 
  Например `yarn test 1 js school` запустит тест для `task1/task1_school.js`, вы можете использовать 
  это для проверки своего решения
* `--run` – флаг простого запуска, вместо прогона тестов просто запускает процесс решения и пробрасывает stdio
* `--big` – флаг прогона "большого" теста из отдельного файла `bigtest.txt`, вывод будет сверен с файлом `biganswer.txt`

## Ручная проверка

Тесты и ответы к ним указаны в файлах `/year/taskN/tests.txt`, например 
[2021/task1/tests.txt](https://github.com/hhru/school-tasks-tester/blob/master/2021/task1/tests.txt). 

Формат каждого теста:
```text
строка stdin
[строка stdin, ...]

строка stdout
[строка stdout, ...]
##
```

Также, в некоторых заданиях есть файл bigtest.txt, это один большой тест, правильный ответ 
для него указан в файле biganswer.txt