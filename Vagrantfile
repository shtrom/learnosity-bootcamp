# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y apache2 php5
    cp /vagrant/apache_conf/000-default.conf /etc/apache2/sites-available/000-default.conf
    a2enmod rewrite
    service apache2 restart
    if ! [ -L /var/www ]; then
      rm -rf /var/www
      ln -fs /vagrant/build /var/www
    fi
  SHELL
end
