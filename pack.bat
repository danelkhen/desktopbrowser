rmdir pack /s /q
md pack

cd desktopbrowser-client
call npm pack
move *.tgz ..\pack\
cd ..

cd desktopbrowser-server
call npm pack
move *.tgz ..\pack\
cd ..
