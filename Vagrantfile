# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y apache2 php5
    if ! [ -L /var/www/html ]; then
      rm -rf /var/www/html
      ln -fs /vagrant/build /var/www/html
    fi
  SHELL
end
