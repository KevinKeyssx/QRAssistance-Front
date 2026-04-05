import type { LDSClass } from '$lib/types';
import QuorumIcon        from '$lib/icons/QuorumIcon.svelte';
import SOCIcon           from '$lib/icons/SOCIcon.svelte';
import SchoolIcon        from '$lib/icons/SchoolIcon.svelte';
import YoungWomenIcon    from '$lib/icons/YoungWomenIcon.svelte';
import YoungMenIcon      from '$lib/icons/YoungMenIcon.svelte';
// import PrimaryIcon       from '$lib/icons/PrimaryIcon.svelte';
import JASIcon           from '$lib/icons/JASIcon.svelte';
import FriendsIcon       from '$lib/icons/FriendsIcon.svelte';


export const LDS_CLASSES: LDSClass[] = [
	{ slug: 'quorum-elders',        label: 'Quórum de élderes',                 icon: QuorumIcon,     classCompatible: [ 'jas', 'friends', 'sunday-school-adults' ]},
	{ slug: 'relief-society',       label: 'Sociedad de socorro',               icon: SOCIcon,        classCompatible: [ 'jas', 'friends', 'sunday-school-adults' ]},
	{ slug: 'sunday-school-young',  label: 'Escuela dominical jóvenes',         icon: SchoolIcon,     classCompatible: [ 'young-men', 'young-women' ]},
	{ slug: 'sunday-school-adults', label: 'Escuela dominical adúltos',         icon: SchoolIcon,     classCompatible: [ 'quorum-elders', 'relief-society', 'friends' ]},
	{ slug: 'young-men',            label: 'Quórumes de sacerdocio aaronico',   icon: YoungMenIcon,   classCompatible: [ 'sunday-school-young' ]},
	{ slug: 'young-women',          label: 'Mujeres jóvenes',                   icon: YoungWomenIcon, classCompatible: [ 'sunday-school-young' ]},
	{ slug: 'jas',                  label: 'JAS',                               icon: JASIcon,        classCompatible: [ 'quorum-elders', 'relief-society', 'sunday-school-adults' ]},
	{ slug: 'friends',              label: 'Clase amigos',                      icon: FriendsIcon,    classCompatible: [ 'quorum-elders', 'relief-society', 'sunday-school-adults' ] },
	// { slug: 'primary',              label: 'Primaria',                  icon: PrimaryIcon,    classCompatible: [] },
];
