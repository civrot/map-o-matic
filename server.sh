!#/bin/sh
ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 8080, :DocumentRoot => "#{Dir.pwd}/public").start'

