**Мигрируйте проект на TypeScript**

Алгоритм миграции:
1. Создать папку dist
2. Поменять настройки package.json на папку dist (main и script/start)
3. Настроить tsconfig.json - target = es6, module = commonjs, outDir и rootDir
4. Заменить расширение файлов в src с js на ts
5. Заменить импорты зависимостей с require на import/export
6. Типизировать переменные (либо временные any)