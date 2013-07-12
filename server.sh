!#/bin/sh
ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => "#{Dir.pwd}/public").start'

