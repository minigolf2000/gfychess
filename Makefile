lint:
	yarn tslint -c tslint.json 'app/**/*.ts*'

deploy:
	yarn build
	scp index.html gfychess.css dist/bundle-gfychess.js favicon.ico golfsinteppadon.com:/var/www/gfychess.com

deploy-images:
	ssh golfsinteppadon.com "mkdir /var/www/gfychess.com/public"
	scp public/* golfsinteppadon.com:/var/www/gfychess.com/public
