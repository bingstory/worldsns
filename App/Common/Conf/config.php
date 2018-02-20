<?php
return array(
	//数据库配置信息
    'DB_TYPE'   => 'mysql', // 数据库类型
    'DB_HOST'   => 'localhost', // 服务器地址
    'DB_NAME'   => 'worldsns', // 数据库名
    'DB_USER'   => 'worldsns', // 用户名
    'DB_PWD'    => 'xyz98765', // 密码

    'DB_PORT'   => 3306, // 端口
    'DB_PREFIX' => '', // 数据库表前缀 
    'DB_CHARSET'=> 'utf8', // 字符集
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增

    //默认模块配置
    'DEFAULT_MODULE'        =>  'Index',  // 默认模块
    'DEFAULT_CONTROLLER'    =>  'Home', // 默认控制器名称

    //多语言配置
    'LANG_SWITCH_ON'    => true,   // 开启语言包功能
    'LANG_AUTO_DETECT'  => true, // 自动侦测语言 开启多语言功能后有效
    'DEFAULT_LANG'      => 'zh-cn',
    'LANG_LIST'         => "zh-cn,zh-tw,en-us,ja,es,ko-kr,de,fra,it,nl,pt,ru", // 允许切换的语言列表 用逗号分隔
    'VAR_LANGUAGE'      => "l", // 默认语言切换变量

    //配置URL模式
     'URL_MODEL'        =>  0,

     'DISCOVER_NUM'     => 20,
     'PAGE_NUM'         => 20,
     'BROADCAST_NUM'    => 10,
     'BROADCAST_PAGE_NUM' => 10,

);
